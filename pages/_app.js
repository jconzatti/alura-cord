import appConfig from '../config.json';

function GlobalStyle() {
    return (
        <style global jsx>{`
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                list-style: none;
            }
            *::-webkit-scrollbar {
                width: 5px;
                height: 0px;
            }
            
            *::-webkit-scrollbar-track {
                background: ${appConfig.theme.colors.primary["500"]};
            }
            
            *::-webkit-scrollbar-thumb {
                border-radius: 20px;
                border: 3px solid ${appConfig.theme.colors.primary["900"]};
            }

            body {
                font-family: 'Open Sans', sans-serif;
            }
            
            /* App fit Height */ 
            html, body, #__next {
                min-height: 100vh;
                display: flex;
                flex: 1;
            }
            #__next {
                flex: 1;
            }
            #__next > * {
                flex: 1;
            }
            /* ./App fit Height */ 
        `}</style>
    );
}

export default function({ Component, pageProps }) {
    return (
        <>
            <GlobalStyle/>
            <Component {...pageProps}/>
        </>
    )
}