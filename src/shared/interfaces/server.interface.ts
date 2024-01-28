export interface Server extends Record<string, any> {
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
