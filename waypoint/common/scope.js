const getScopesParams = scopes => scopes ? scopes.join(" ") : undefined;
const getDelegationScopesParams = scopes => {
  const initialScopes = scopes?.includes("wallet") ? scopes : [...(scopes ?? []), "wallet"];
  return getScopesParams(initialScopes);
};

export { getDelegationScopesParams, getScopesParams };
