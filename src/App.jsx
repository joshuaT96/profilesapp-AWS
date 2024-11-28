import { useState, useEffect } from "react";
import {Button, Heading, Flex, View, Grid, Divider,} from "@aws-amplify/ui-react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
//import { getVcomBessData } from "../amplify/data/getVcomBessData";
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient({
  authMode: "userPool",
});

export default function App() {
  const [userprofiles, setUserProfiles] = useState([]);
  const [vcomData, setVcomData] = useState(null);
  const { signOut } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    fetchUserProfile();
    fetchVcomBessData();
  }, []);

  //get user profiles
  async function fetchUserProfile() {
    const { data: profiles } = await client.models.UserProfile.list();
    setUserProfiles(profiles);
  }

  //get vcom data
  async function fetchVcomBessData() {
    try{
      const {data, errors} = await client.queries.getVcomBessdata({index: 0});
      if(errors) {
        console.error(errors);
      }else{
        setVcomData(data)
      }
    }catch (error) {
      console.error("Error fetching VCOM data: ", error)
    }
  }

  return (
    <Flex
      className="App"
      justifyContent="center"
      alignItems="center"
      direction="column"
      width="70%"
      margin="0 auto"
    >
      <Heading level={1}>My Profile</Heading>

      <Divider />

      <Grid
        margin="3rem 0"
        autoFlow="column"
        justifyContent="center"
        gap="2rem"
        alignContent="center"
      >
        {userprofiles.map((userprofile) => (
          <Flex
            key={userprofile.id || userprofile.email}
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap="2rem"
            border="3px solid #aca"
            padding="3rem"
            borderRadius="20%"
            className="box"
          >
            <View>
              <Heading level="3">{userprofile.email}</Heading>
              <Heading level="1">{userprofile.email}</Heading>
            </View>
          </Flex>
        ))}
      </Grid>
      
      {/* Display fetched VcomBessData */}
      {vcomData && (
        <div>
          <h2>VcomBessData</h2>
          <pre>{JSON.stringify(vcomData, null, 2)}</pre>
        </div>
      )}

      <Button onClick={signOut}>Sign Out</Button>

    </Flex>

  );
}