export interface Interface {
  name: string;
  mac_address: string | undefined;
  ip_address: string | undefined;
  vendor: string;
  model: string;
  type: string;
  netmask: string | null;
  gateway_ip: string | null;
}
