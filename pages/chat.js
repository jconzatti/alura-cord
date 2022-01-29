import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React from 'react';
import appConfig from '../config.json';
import trashIcon from '../public/trash.png';
import { createClient } from '@supabase/supabase-js';
import {useRouter} from 'next/router';
import {ButtonSendSticker} from '../components/ButtonSendSticker';

const SUPABASE_ANON_KEY ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMyODQyNiwiZXhwIjoxOTU4OTA0NDI2fQ.N1EiE98q6fisFKMAj_el1WUUmQP45YjAzi45gSdHPGM';
const SUPABASE_URL = 'https://kurkxabpwldivpagmjhp.supabase.co';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function ChatPage() {
    const [mensagem, setMensagem] = React.useState('');
    const [listaDeMensagens, setListaDeMensagens] = React.useState([]);
    const router = useRouter();
    const usuarioLogado = router.query.username;//o usuário logado é passado na url do chat

    React.useEffect(
        function(){
            //carrega todas as mensagens na tela, acontece apenas quando a tela é carregada
            supabase.from('TBMensagem').select('*').order('CdMensagem', {ascending: false}).then(
                function({data}){ //{data} equivale a param.data
                    const aListaMensagem = [];
                    data.forEach(
                        function(aMensagem){
                            aListaMensagem.push(
                                {
                                    id: aMensagem.CdMensagem,
                                    de: aMensagem.DsUsuario,
                                    texto: aMensagem.DsMensagem
                                }
                            )
                        }
                    );
                    setListaDeMensagens(aListaMensagem);
                }
            );
            
            //registra o evento que deve acontecer no client quando um registro é inserido no server
            const subscribeInsertForTBMensagem = supabase.from('TBMensagem').on(
                'INSERT',
                function(data){
                    // Quero reusar um valor de referencia (objeto/array) 
                    // Passar uma função pro setState
                    //setListaDeMensagens(
                    //    [
                    //        {
                    //            id: data.new.CdMensagem,
                    //            de: data.new.DsUsuario,
                    //            texto: data.new.DsMensagem,
                    //        },
                    //        ...listaDeMensagens,
                    //    ]
                    //);
                    setListaDeMensagens(
                        function (atualValueOfListaMensagem){
                            return [
                                {
                                    id: data.new.CdMensagem,
                                    de: data.new.DsUsuario,
                                    texto: data.new.DsMensagem,
                                },
                                ...atualValueOfListaMensagem,
                            ]
                        }
                    );
                }
            ).subscribe();
            
            //o retorno é a função que é disparada quado a página é descarregada
            return function(){
                subscribeInsertForTBMensagem.unsubscribe(); 
            }
        },
        []
    );

    /*
    // Usuário
    - Usuário digita no campo textarea
    - Aperta enter para enviar
    - Tem que adicionar o texto na listagem
    
    // Dev
    - [X] Campo criado
    - [X] Vamos usar o onChange usa o useState (ter if pra caso seja enter pra limpar a variavel)
    - [X] Lista de mensagens 
    */


    function handleNovaMensagem(novaMensagem) {
        const aMensagem = {
            DsUsuario: usuarioLogado,
            DsMensagem: novaMensagem
        };

        //vai adicionar a mensagem no banco,
        //quando é adicionada o evento de atualização de lista em mensagens é disparado
        supabase.from('TBMensagem').insert([aMensagem]).then();

        setMensagem('');
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary[500],
                backgroundImage: `url(https://miro.medium.com/max/1400/1*cEuSobgTBmXiYLxbK6x0Dg.jpeg)`,
                backgroundRepeat: 'no-repeat', 
                backgroundSize: 'cover', 
                backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    height: '100%',
                    maxWidth: '95%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >
                    <MessageList mensagens={listaDeMensagens} setMensagens={setListaDeMensagens}/>
                    
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                const valor = event.target.value;
                                setMensagem(valor);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === 'Enter') {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                }
                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        
                        <Button
                            label='Enviar'
                            buttonColors={
                                {
                                    contrastColor: appConfig.theme.colors.neutrals["000"],
                                    mainColor: appConfig.theme.colors.primary[500],
                                    mainColorLight: appConfig.theme.colors.primary[400],
                                    mainColorStrong: appConfig.theme.colors.primary[600],
                                }
                            }
                            onClick={
                                () => {
                                    handleNovaMensagem(mensagem);
                                }
                            }
                            styleSheet={
                                {
                                    marginRight: '12px'
                                }
                            }
                        />

                        <ButtonSendSticker
                            onStickerClick = {
                                function (sticker){
                                    handleNovaMensagem(':sticker:'+sticker)  
                                }
                            }
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text 
                    variant='heading5'
                    styleSheet={{
                        color: appConfig.theme.colors.primary[500],
                    }}
                >
                    Chat
                </Text>
                <Button
                    label='Logout'
                    href="/"
                    buttonColors={
                        {
                            contrastColor: appConfig.theme.colors.neutrals["000"],
                            mainColor: appConfig.theme.colors.primary[500],
                            mainColorLight: appConfig.theme.colors.primary[400],
                            mainColorStrong: appConfig.theme.colors.primary[600],
                        }
                    }
                />
                {/*<Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />*/}
            </Box>
        </>
    )
}

function MessageList(props) {

    function getStickerOrText(DesTexto){
        if (DesTexto.startsWith(':sticker:')){
            return (
                <Image 
                    styleSheet={
                        {
                            maxHeight: '120px',
                            maxWidth: '200px'
                        }
                    }
                    src={DesTexto.replace(':sticker:', '')}
                />
            );
        }
        return DesTexto;
    }

    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'scroll',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >
                            <Image
                                styleSheet={{
                                    width: '25px',
                                    height: '25px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.primary[500],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                            <Image
                                styleSheet={{
                                    width: '25px',
                                    height: '25px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginLeft: '12px'
                                }}
                                src={trashIcon.src}
                                onClick={
                                    function(){
                                        const listaDeMensagensNova = props.mensagens.filter(
                                            function (msg) {
                                                return msg.id != mensagem.id;
                                            }
                                        );
                                        props.setMensagens(listaDeMensagensNova);
                                    }
                                }
                            />
                        </Box>
                        {getStickerOrText(mensagem.texto)}
                    </Text>
                );
            })}
        </Box>
    )
}