function versionCheck(currentVersion: string, minSupportVersion: string, acceptEqual = true): boolean {
  const currentVersionParts = currentVersion.split('.');
  const minSupportVersionParts = minSupportVersion.split('.');
  for (let i = 0; i < currentVersionParts.length; ++i) {
    if (minSupportVersionParts[i] === currentVersionParts[i]) continue;
    if (minSupportVersionParts[i] > currentVersionParts[i]) return false;
    return true;
  }
  return acceptEqual;
}

export default versionCheck;
