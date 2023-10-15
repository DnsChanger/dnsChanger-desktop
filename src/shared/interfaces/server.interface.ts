export interface Server {
  key: string;
  name: string;
  servers: string[];
  avatar: string;
  rate: number;
  tags: string[];
}
export interface ServerStore extends Server {
  isPin: boolean;
}
