export type PlusServiceViewProps = {
  onLoginPress: () => {},
  onPressItem: () => {},
  onPressCreateRequest: () => {},
  plusServices: {
    all: Array<{
      requestTypeId: String,
      requestTypeName: String,
      requestTypeDescription: String,
      icon: String,
    }>,
  },
};
