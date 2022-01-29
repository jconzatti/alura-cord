//Use o comando "npm run dev" no terminal para rodar o projeto no navegador
import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import React from 'react';
import {useRouter} from 'next/router';
import appConfig from '../config.json';
import userIcon from '../public/user.png';
import Titulo from '../components/titulo';

export default function PaginaInicial() {
    //esse é o core do react
    const [username, setUsername] = React.useState('');
    const [nomeCompleto, setNomeCompleto] = React.useState('');
    const [endereco, setEndereco] = React.useState('');
    const [userPicture, setUserPicture] = React.useState(userIcon.src);
    const router = useRouter();

    return (
        <>
            <Box
                styleSheet={
                    {
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: appConfig.theme.colors.primary[500],
                        backgroundImage: 'url(https://miro.medium.com/max/1400/1*cEuSobgTBmXiYLxbK6x0Dg.jpeg)',
                        backgroundRepeat: 'no-repeat', 
                        backgroundSize: 'cover', 
                        backgroundBlendMode: 'multiply',
                    }
                }
            >
                <Box
                    styleSheet={
                        {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: {
                                xs: 'column',
                                sm: 'row',
                            },
                            width: '100%', 
                            maxWidth: '700px',
                            borderRadius: '5px', 
                            padding: '32px', 
                            margin: '16px',
                            boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                            backgroundColor: appConfig.theme.colors.neutrals[700],
                        }
                    }
                >
                    {/* Formulário */}
                    <Box
                        as="form"
                        onSubmit={
                            function(event){
                                //para NÃO recarregar a página
                                event.preventDefault(); 
                                //ir para a próxima página sem recarregar
                                router.push(`/chat?username=${username}`);

                                //Maneira default de mudar de página (realiza re carregamento)
                                //window.location.href = '/chat'
                            }
                        }
                        styleSheet={
                            {
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                width: { 
                                    xs: '100%', 
                                    sm: '50%' 
                                }, 
                                textAlign: 'center', 
                                marginBottom: '32px',
                            }
                        }
                    >
                        <Titulo tag="h2">Bem vindo de volta!</Titulo>
                        <Text 
                            variant="body3" 
                            styleSheet={
                                { 
                                    marginBottom: '32px', 
                                    color: appConfig.theme.colors.neutrals[300] 
                                }
                            }
                        >
                            {appConfig.name}
                        </Text>

                        <TextField
                            fullWidth
                            textFieldColors={
                                {
                                    neutral: {
                                        textColor: appConfig.theme.colors.neutrals[200],
                                        mainColor: appConfig.theme.colors.neutrals[900],
                                        mainColorHighlight: appConfig.theme.colors.primary[500],
                                        backgroundColor: appConfig.theme.colors.neutrals[800],
                                    }
                                }
                            }
                            value={username}
                            onChange={
                                function (event){
                                    const usernameValue = event.target.value;
                                    setUsername(usernameValue);
                                    if (usernameValue.length > 2){
                                        setUserPicture(`https://github.com/${usernameValue}.png`);

                                        const url = `https://api.github.com/users/${usernameValue}`;
                                        fetch(url)
                                        .then(
                                            async function(resp){
                                                return await resp.json()
                                            }
                                        )
                                        .then(
                                            function(data) {
                                                setNomeCompleto(data.name);
                                                setEndereco(data.location);
                                            }
                                        )
                                        .catch(
                                            function(error) {
                                                console.log(error);
                                                setNomeCompleto('');
                                                setEndereco('');
                                            }
                                        );
                                    }else{
                                        setUserPicture(userIcon.src);
                                        setNomeCompleto('');
                                        setEndereco('');
                                    }

                                }
                            }
                        />
                        <Button
                            type='submit'
                            label='Entrar'
                            fullWidth
                            buttonColors={
                                {
                                    contrastColor: appConfig.theme.colors.neutrals["000"],
                                    mainColor: appConfig.theme.colors.primary[500],
                                    mainColorLight: appConfig.theme.colors.primary[400],
                                    mainColorStrong: appConfig.theme.colors.primary[600],
                                }
                            }
                        />
                    </Box>
                    {/* Formulário */}


                    {/* Photo Area */}
                    <Box
                        styleSheet={
                            {
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                maxWidth: '200px',
                                padding: '16px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                border: '1px solid',
                                borderColor: appConfig.theme.colors.neutrals[999],
                                borderRadius: '10px',
                                flex: 1,
                                minHeight: '240px',
                            }
                        }
                    >
                        <Image
                            styleSheet={
                                {
                                    borderRadius: '50%',
                                    marginBottom: '16px',
                                }
                            }
                            src={userPicture}
                        />
                        <Text
                            variant="body4"
                            styleSheet={
                                {
                                    color: appConfig.theme.colors.neutrals[200],
                                    backgroundColor: appConfig.theme.colors.neutrals[900],
                                    padding: '3px 10px',
                                    borderRadius: '1000px'
                                }
                            }
                        >
                            {nomeCompleto}
                        </Text>
                        <Text
                            variant="body4"
                            styleSheet={
                                {
                                    color: appConfig.theme.colors.neutrals[200],
                                    backgroundColor: appConfig.theme.colors.neutrals[900],
                                    padding: '3px 10px',
                                    borderRadius: '1000px'
                                }
                            }
                        >
                            {endereco}
                        </Text>
                    </Box>
                    {/* Photo Area */}
                </Box>
            </Box>
        </>
    );
}