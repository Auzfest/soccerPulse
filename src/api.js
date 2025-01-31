import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: 'us-east-1' });

export async function GET(req, res) {
  const userId = req.headers['user-id']; // Or however you identify users
  try {
    const result = await client.send(new GetCommand({
      TableName: "YourDynamoDBTable",
      Key: { userId }
    }));
    return new Response(JSON.stringify(result.Item), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error fetching data', { status: 500 });
  }
}


export async function getServerSideProps() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/soccer_Pulse`);

  if (!res.ok) {
      console.error(`HTTP error! status: ${res.status}`);
      return {
          props: {
              soccerPulseData: [],
          },
      };
  }
  const data = await res.json();
  const soccerPulseData = Array.isArray(data) ? data : data.Items || [];
  return {
      props: {
          soccerPulseData,
      },
  };
}