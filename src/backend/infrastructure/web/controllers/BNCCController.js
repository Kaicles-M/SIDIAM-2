class BNCCController {
  constructor(listBNCCUseCase) {
    this.listBNCCUseCase = listBNCCUseCase;
  }

  async list(req, res) {
    const { level, grade } = req.query;
    try {
      const data = await this.listBNCCUseCase.execute(level, grade);
      res.json(data);
    } catch (err) {
      const statusCode = err.statusCode || 500;
      res.status(statusCode).json({ error: err.message });
    }
  }
}

module.exports = BNCCController;
