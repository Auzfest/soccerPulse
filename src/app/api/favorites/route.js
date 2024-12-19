import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";


const client = new DynamoDBClient({ region: 'us-east-2', removeUndefinedValues: true });

export async function GET(req, res) {
  const userEmail = req.headers.get('user-email')
  console.log("Received user-email header:", userEmail); 

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

  console.log("Received user-email and item:", userEmail, newItem);

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
    console.log("User ID:", userID);
    if (newItem.teamId) {
      newItem.teamId = String(newItem.teamId);
      const leagueId = String(newItem.leagueId);
      const teamId = String(newItem.teamId);
      console.log("League and Team detected:", newItem);
      result = await client.send(
        new UpdateCommand({
          TableName: "Soccer_Pulse",
          Key: {
            ID: userID,
          },
          UpdateExpression: "SET #Favorites[1] = list_append(if_not_exists(#Favorites[1], :empty_list), :newItem)",
          ExpressionAttributeNames: {
            "#Favorites": "Favorites",
          },
          ExpressionAttributeValues: {
            ":newItem": [[leagueId, teamId]],
            ":empty_list": [],
          },
          ReturnValues: "UPDATED_NEW",
        })
      );
    } else if (newItem.leagueId && !newItem.teamId) {
      console.log("Only League detected:", newItem);
      const leagueId = String(newItem.leagueId);
      result = await client.send(
        new UpdateCommand({
          TableName: "Soccer_Pulse",
          Key: {
            ID: userID,
          },
          UpdateExpression: "SET #Favorites[0] = list_append(if_not_exists(#Favorites[0], :empty_list), :newItem)",
          ExpressionAttributeNames: {
            "#Favorites": "Favorites",
          },
          ExpressionAttributeValues: {
            ":newItem": [leagueId],
            ":empty_list": [],
          },
          ReturnValues: "UPDATED_NEW",
        })
      );
    } else {
      console.error("Invalid newItem format");
      return new Response(
        JSON.stringify({ error: "Invalid newItem format" }),
        { status: 400 }
      );
    }
    console.log("Update successful:", result);
    return new Response(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Error updating data:", error);
    return new Response('Error updating data', { status: 500 });
  }
}