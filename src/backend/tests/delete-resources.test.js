const SchoolController = require('../infrastructure/web/controllers/SchoolController');

describe('SchoolController delete', () => {
  it('returns success for a valid school deletion', async () => {
    const deleteSchoolUseCase = { execute: jest.fn().mockResolvedValue({ success: true }) };
    const controller = new SchoolController(null, null, deleteSchoolUseCase);

    const req = { params: { id: 'school-1' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await controller.remove(req, res);

    expect(deleteSchoolUseCase.execute).toHaveBeenCalledWith('school-1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });
});
