declare module "react-octicon" {
  const Octicon: React.ComponentType<{
    name: string;
    spin?: boolean,
    mega?: boolean
  } & React.HTMLAttributes<HTMLSpanElement>>;
  export = Octicon;
}
