export interface DubboInfo {
    req: Req;
    res: Res;
    path: string;
}

export interface Res {
    appResponse: object;
    error: object;
    responseProps: object;
}

export interface Req {
    targetAppName: string;
    serverSignature: string;
    group: string;
    methodName: string;
    args: Args[];
    timeout: number;
    requestProps: RequestProps;
    ctx: Ctx;
    meta: Meta;
}

export interface Meta {
    id: number;
    resultCode: string;
    connectionGroup: string;
    codecType: string;
    start: number;
    timeout: number;
    address: Address;
    requestEncodeStart: number;
    requestEncodeRT: number;
    reqSize: number;
    responseDecodeStart: number;
    responseDecodeRT: number;
    resSize: number;
    rt: number;
    error: object;
}

export interface Address {
    protocol: string;
    slashes: boolean;
    auth: object;
    host: string;
    port: string;
    hostname: string;
    hash: object;
    search: string;
    query: Query;
    pathname: string;
    path: string;
    href: string;
}

export interface Query {
    anyhost: string;
    application: string;
    'default.service.filter': string;
    delay: string;
    dubbo: string;
    generic: string;
    interface: string;
    methods: string;
    owner: string;
    pid: string;
    revision: string;
    side: string;
    threads: string;
    timestamp: string;
    version: string;
}

export interface Ctx {
    request: Request;
    originalUrl: string;
}

export interface Request {
    method: string;
    url: string;
    header: any;
}

export interface Header {
    host: string;
    connection: string;
    'cache-control': string;
    dnt: string;
    'upgrade-insecure-requests': string;
    'user-agent': string;
    'sec-fetch-dest': string;
    accept: string;
    'sec-fetch-site': string;
    'sec-fetch-mode': string;
    'sec-fetch-user': string;
    'accept-encoding': string;
    'accept-language': string;
    cookie: string;
}

export interface RequestProps {
    service: string;
}

export interface Args {
    $class: string;
    $: any;
    type: string;
}
