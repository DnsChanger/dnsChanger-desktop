interface NetworkAdapter {
  address: string;
  netmask: string;
  family: string;
  mac: string;
  internal: boolean;
  cidr: string;
  scopeid?: number;
}

export interface NetworkAdapters {
  [key: string]: NetworkAdapter[];
}
