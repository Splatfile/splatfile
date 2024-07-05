import React from "react";

type ComponentProps = {
  isMine: boolean;
};

type ComponentWrapperProps<P extends ComponentProps> = {
  componentForClient: React.FC<
    Omit<P, "componentForClient" | "serverOnlyComponent">
  >;
  serverOnlyComponent: React.FC<
    Omit<P, "componentForClient" | "serverOnlyComponent">
  >;
} & P;

export function ComponentWrapper<T extends ComponentProps>(
  props: ComponentWrapperProps<T>,
) {
  const {
    componentForClient: ComponentForClient,
    serverOnlyComponent: ServerOnlyComponent,
    ...otherProps
  } = props;

  return props.isMine ? (
    <ComponentForClient {...otherProps} />
  ) : (
    <ServerOnlyComponent {...otherProps} />
  );
}
