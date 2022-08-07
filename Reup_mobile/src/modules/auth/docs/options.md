#Options

```
{
    STORAGE_KEY?: string,
    baseUrl?: string,
    endPoint?: {
        ME: string,
        LOGIN: string,
        SIGN_UP: string,
        LOGIN_FACEBOOK: string,
        LOGIN_GOOGLE: string,
        LOG_OUT: string,
        UPDATE_PASSWORD: string,
        UPDATE_PROFILE: string,
        RESET_PASSWORD: string,
    },
    setToken?: (token: string) => Promise<any>,
    getToken?: () => Promise<string | null>,
    getCurrentUser?: (token?: string) => Promise<IUserOrNull>,
    login?: (email: string, password: string) => Promise<IUserOrError>,
    loginFacebook?: (token: string) => Promise<IUserOrError>,
    loginGoogle?: (idToken: string, accessToken: string) => Promise<IUserOrError>,
    logout?: () => Promise<Boolean | IError>,
    updatePassword?: (password: string, oldPassword?: string) => Promise<Boolean | IError>,
    updateProfile?: (payload: any) => Promise<IUserOrError>,
    sendPasswordResetEmail?: (email: string) => Promise<Boolean | IError>,
    signUp?: (email: string, password: string) => Promise<IUserOrError>,
}
```
