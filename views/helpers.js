module.exports = {
  getError(errors, prop) {
    if (errors) {
      try {
        return errors.mapped()[prop].msg;
      } catch (error) {
        return '';
      }
    } else {
      return '';
    }
  }
};