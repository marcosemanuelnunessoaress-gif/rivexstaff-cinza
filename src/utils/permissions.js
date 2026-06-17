const { PermissionFlagsBits } = require('discord.js');

function isAdministrador(member) {
  return member.permissions.has(PermissionFlagsBits.Administrator);
}

module.exports = {
  isAdministrador
};