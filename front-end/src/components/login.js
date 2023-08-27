import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import '@fontsource-variable/open-sans'
import '@fontsource-variable/spline-sans'

import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  Stack,
  Text,
} from '@chakra-ui/react'
import { OAuthButtonGroup } from './OAuthButtonGroup'
import { PasswordField } from './PasswordField'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  styles: {
    global: () => ({ 
      body: {
        fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
        color: "#EEE",
        bg: "",
        transitionProperty: "",
        transitionDuration: "",
        lineHeight: "",
      },
      '.stats-table': {
        h2: {
          fontSize: "3xl",
          fontWeight: "extrabold"
        }
      }
    }),
  },
  components: {
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Link,
    Stack,
    Text,
  }
});

const API_BASE = "https://metachess-server.onrender.com"

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams();
  const [falsePass, setFalsePass] = useState(false);

  useEffect(() => {
      fetch(API_BASE + "/user")
              .then(res => res.json())
              .then(data => setUsers(data))
              .catch(err => console.error("Error: ", err));
  }, [])

  const handleSignUp = async (event) => {
    event.preventDefault();
    setFalsePass(false);

    // Redirect to the desired route after successful sign-up
    const data = await fetch(API_BASE + "/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    }).then(res => res.json());
    if (data.username === "`") {
        navigate("/login/" + username);
    } else if (data.username === "") {
        setFalsePass(true);
        navigate("/login/:userId")
    } else {
        navigate("/login/" + username);
        setUsers([...users, data]);
    }
    setUsername("");
    setPassword("");
  };
 
  return (
    <div className='all'>
      <ChakraProvider theme={theme}>
        <Container
          maxW="lg"
          py={{
            base: '12',
            md: '24',
          }}
          px={{
            base: '0',
            sm: '8',
          }}
        >
          <Stack spacing="5">
            <Stack spacing="6">
              {/* <Logo /> */}
              <Stack
                spacing={{
                  base: '2',
                  md: '3',
                }}
                textAlign="center"
              >
                <Heading
                  size={{
                    base: 'xl',
                    md: 'xl',
                  }}
                >
                  Log in to your account
                </Heading>
                <Text color="fg.muted">
                  Don't have an account? Sign up with a unique Username
                </Text>
                <Text fontSize="sm">
                  (please wait for the Leaderboard to display users)
                </Text>
              </Stack>
            </Stack>
            <Box
              py={{
                base: '0',
                sm: '8',
              }}
              px={{
                base: '4',
                sm: '10',
              }}
              bg={{
                base: 'transparent',
                sm: 'rgba(0,0,0,0.2)', 
              }}
              boxShadow={{
                base: 'none',
                sm: 'inset 0 -.1rem 0 0 rgba(0, 0, 0, 0.4)',
              }}
              borderRadius={{
                base: 'none',
                sm: 'xl',
              }}
            >
              <Stack spacing="6">
                <Stack spacing="5">
                  <form onSubmit={handleSignUp}>
                  <Stack spacing="10">
                  <FormControl>
                    <Stack spacing='5'>
                      <Stack spacing="0">
                        <FormLabel htmlFor="username">Username</FormLabel>
                        <Input id="username"
                          type="text"
                          placeholder='Case Sensitive'
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                      </Stack>
                      <PasswordField
                        // type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </Stack>
                  </FormControl>
                    <Stack spacing="6">
                      <Button _hover={{ bg: '#202B3E' }} _active={{ bg: 'rgba(0, 0, 0, 0.1)', transform: 'scale(0.98)', borderColor: '#bec3c9', }} bg="rgba(0, 0, 0, 0.4)" type="submit">
                        <Text color="#EEE" fontWeight="normal">Sign in</Text>
                      </Button>
                      {userId !== ":userId" ? (
                        <>
                          <HStack>
                            <Divider/>
                              <Text textStyle="sm" whiteSpace="nowrap" color="#03C04A" fontWeight="bold">
                                Signed in | {userId}
                              </Text>
                            <Divider />
                            </HStack>
                          <OAuthButtonGroup prop={userId}/>
                        </>
                      ) : falsePass ? ( 
                        <>
                          <HStack>
                            <Divider/>
                              <Text textStyle="sm" whiteSpace="nowrap" color="red" fontWeight="bold">
                                Incorrect Password
                              </Text>
                            <Divider />
                          </HStack>
                        </>
                      ) : ""}
                    </Stack>
                  </Stack>
                  </form>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </Container>
      </ChakraProvider>
      <div className='stats-table lld'>
        <div id="lead">
          <img src="https://www.chess.com/bundles/web/images/color-icons/leaderboard.4044c4af.svg" alt=""/>
          <h2>Leaderboard</h2>
        </div>
        <table id="customers">
            <tr>
                <th><div className='wil'>Username</div></th>
                <th><div className='wil'>Password</div></th>
                <th>
                    <div className='wil'>
                    <img src="https://trackercdn.com/cdn/destinytracker.com/elo/Challenger.png" alt="" className='wl'/>
                    ELO
                    </div>
                </th>
                <th>
                  <div className='wil'>
                    <img src="https://www.chess.com/bundles/web/images/color-icons/blitz.a0e36339.svg" alt="" className='wl'/>
                    Wins
                  </div>
                </th>
                <th>
                  <div className='wil'>
                    <img src="https://www.chess.com/bundles/web/images/color-icons/blitz.a0e36339.svg" alt="" className='wl'/>
                    Losses
                  </div>
                </th>
                <th>
                  <div className='wil'>
                    <img src="https://www.chess.com/bundles/web/images/color-icons/computer.2318c3b4.svg" alt="" className='wl'/>
                    Wins
                  </div>
                </th>
            </tr>
            {users.map(user => (
              <tr>
                <td>{user.username}</td>
                <td>{user.password}</td>
                <td>{user.elo}</td>
                <td>{user.wins}</td>
                <td>{user.losses}</td>
                <td>{user.compWins}</td>
              </tr>
            ))}
        </table>
      </div>
    </div>
  );
};

export default Login;
