export interface Handler {
    giveHandlerRegister(): object;
    get(): any;
    set(): any;
    delete(): any;
}
