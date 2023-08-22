import { Button, ButtonGroup, VisuallyHidden, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom';

const providers = [
    {
        name: "Online",
        icon: "https://www.chess.com/bundles/web/images/color-icons/blitz.a0e36339.svg"
    },
    {
        name: "Computer",
        icon: "https://www.chess.com/bundles/web/images/color-icons/computer.2318c3b4.svg"
    }
]



export const OAuthButtonGroup = ({ prop }) => {
    const navigate = useNavigate();
    return (
        <ButtonGroup variant="secondary" spacing="4">
            {providers.map(({ name, icon }) => (
            <Button _hover={{ bg: '#202B3E' }} order='1px' size='lg' borderColor='green.500' variant="outline" colorScheme='' key={name} flexGrow={1} bg="rgba(0, 0, 0, 0.4)" onClick={() => navigate(`/game/${name}/` + prop)}>
                <VisuallyHidden>Sign in with {name}</VisuallyHidden>
                <img src={icon} alt="" className='wl'></img>
                <Text>{name}</Text>
            </Button>
            ))}
        </ButtonGroup>
    )
}