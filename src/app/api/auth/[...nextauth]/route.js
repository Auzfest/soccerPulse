import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import AWS from "aws-sdk";
import bcrypt from "bcryptjs"; // Import bcrypt for password comparison

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
        const params = {
          TableName: "Soccer_Pulse",
          IndexName: "Email-index", // Query by Email only
          KeyConditionExpression: "Email = :email",
          ExpressionAttributeValues: {
            ":email": credentials.email
          }
        };

        try {
          const result = await dynamoDb.query(params).promise();

          if (result.Items && result.Items.length > 0) {
            const user = result.Items[0];

            // Verify password using bcrypt
            const passwordMatch = await bcrypt.compare(credentials.password, user.Password);
            if (!passwordMatch) {
              return null;
            }

            return {
              id: user.ID, // Ensure user ID is used correctly
              email: user.Email
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error querying DynamoDB:", error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
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