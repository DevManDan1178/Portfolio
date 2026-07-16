export type EnvironmentVariables = {
    requestURLBase: string, 
    API_KEY: string
} 

export default function getEnvironmentVariables() : EnvironmentVariables | undefined {
    const requestURLBase : string | undefined = process.env.API_URL;
    const API_KEY : string | undefined =  process.env.API_KEY;
    if (!requestURLBase || !API_KEY) {
        console.log(`Missing environment variables - api key: ${API_KEY} - api url: ${requestURLBase}`)
        return;
    }
    return {
        requestURLBase,
        API_KEY 
    };
}