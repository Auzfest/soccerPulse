import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AWS from "aws-sdk";

AWS.config.update({ region: "us-east-2" });
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        // Query DynamoDB to verify user credentials
        const params = {
          TableName: "Soccer_Pulse",
          IndexName: "Email-Password-index",
          KeyConditionExpression: "Email = :email and Password = :password",          
          ExpressionAttributeValues: {
            ":email": credentials.email,
            ":password": credentials.password
          }
        };

        try {
          const result = await dynamoDb.query(params).promise();
          console.log("DynamoDB scan result:", result); // Debug log to verify result
          if (result.Items && result.Items.length > 0) {
            const user = result.Items[0];
            return {
              id: user.userId, // Replace with your actual user ID field
              email: user.Email, // Email from your database
            };
          } else {
            console.log("No matching user found"); // Log when no user is found
            return null; // Return null if authentication fails
          }
        } catch (error) {
          console.error("Error querying DynamoDB:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt" // Use JWT for sessions
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
        session.user = { id: token.id, email: token.email };
        return session;
    }
  }
};

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
