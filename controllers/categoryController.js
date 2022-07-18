class CategoryController {
  static getAll = async (_req, res) => {
    const responseData = await AuthService.signup();
    return constructResponse(res, responseData);
  };
}
