function temCargoStaff(member) {
  if (!member) return false;

  return member.roles.cache.some(role => role.name.toLowerCase() === '⠀ ⠀ ⠀ staff');
}

module.exports = {
  temCargoStaff
};