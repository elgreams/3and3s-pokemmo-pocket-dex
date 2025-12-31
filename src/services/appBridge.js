const appBridge = {
  async getVersion() {
    const baked = import.meta.env.VITE_APP_VERSION;
    return baked || "web";
  },
};

export default appBridge;
