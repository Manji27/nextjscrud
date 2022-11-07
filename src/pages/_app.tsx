import '../styles/globals.css'
import {ChakraProvider} from "@chakra-ui/react";


// @ts-ignore
function MyApp({Component, pageProps}) {
  return(
      <ChakraProvider>
        <Component { ...pageProps} />
      </ChakraProvider>
      )

}

export default MyApp;