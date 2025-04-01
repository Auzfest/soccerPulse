import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";


const client = new DynamoDBClient({ region: 'us-east-2', removeUndefinedValues: true });

export async function GET(req, res) {
  const userEmail = req.headers.get('user-email')

  if (!userEmail) {
    console.error("Missing user-email header");
    return new Response(JSON.stringify({ error: "Missing user-email header", userEmail }), { status: 400 });
  }

  try {
    const result = await client.send(new QueryCommand({
      TableName: "Soccer_Pulse",
      IndexName: "Email-index", 
      KeyConditionExpression: "Email = :email",
      ExpressionAttributeValues: {
        ":email": userEmail 
      }
    }));
    ("Query result:", result.Items[0]);
    if (result.Items && result.Items.length > 0) {
      return new Response(JSON.stringify(result.Items), { status: 200 });
    } else {
      return new Response(JSON.stringify({ message: "No data found for this email" }), { status: 404 });
    }  
    } catch (error) {
    console.error(error);
    return new Response('Error fetching data', { status: 500 });
  }
}

export async function POST(req, res) {
  const { userEmail, newItem } = await req.json();

  if (!userEmail || !newItem) {
    console.error("Missing user-email or item");
    return new Response(JSON.stringify({ error: "Missing user-email or item" }), { status: 400 });
  }

  try {
    const queryResult = await client.send(
      new QueryCommand({
        TableName: "Soccer_Pulse",
        IndexName: "Email-index",
        KeyConditionExpression: "Email = :email",
        ExpressionAttributeValues: {
          ":email": userEmail,
        },
      })
    );

    if (!queryResult.Items || queryResult.Items.length === 0) {
      console.error("No matching records found for this email");
      return new Response(
        JSON.stringify({ error: "No matching records found for this email" }),
        { status: 404 }
      );
    }

    const userID = queryResult.Items[0].ID;

    let currentFavorites = queryResult.Items[0].Favorites || [[], []];

    // **Remove placeholder zeros**
    currentFavorites = currentFavorites.map(list => 
      Array.isArray(list) ? list.filter(item => {
        if (Array.isArray(item)) {
          return item.every(subItem => subItem !== "0" && subItem !== 0); // Remove arrays with "0"
        }
        return item !== "0" && item !== 0; // Remove single "0" entries
      }) : []
    );


    if (newItem.teamId) {
      // **Handling Teams (index 1)**
      const leagueId = String(newItem.leagueId);
      const teamId = String(newItem.teamId);

      // Append after cleaning
      currentFavorites[1].push([leagueId, teamId]);
    } else if (newItem.leagueId && !newItem.teamId) {
      // **Handling Leagues (index 0)**
      const leagueId = String(newItem.leagueId);

      // Append after cleaning
      currentFavorites[0].push(leagueId);
    } else {
      console.error("Invalid newItem format");
      return new Response(
        JSON.stringify({ error: "Invalid newItem format" }),
        { status: 400 }
      );
    }

    // **Update DynamoDB with cleaned & updated list**
    const result = await client.send(
      new UpdateCommand({
        TableName: "Soccer_Pulse",
        Key: {
          ID: userID,
        },
        UpdateExpression: "SET #Favorites = :cleanedList",
        ExpressionAttributeNames: {
          "#Favorites": "Favorites",
        },
        ExpressionAttributeValues: {
          ":cleanedList": currentFavorites,
        },
        ReturnValues: "UPDATED_NEW",
      })
    );

    return new Response(JSON.stringify(result), { status: 200 });

  } catch (error) {
    console.error("Error updating data:", error);
    return new Response('Error updating data', { status: 500 });
  }
}