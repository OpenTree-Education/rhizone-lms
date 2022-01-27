import { listCompetencies } from '../competenciesService';
import { mockQuery } from '../mockDb';

describe('listCompetencies', () => {
  it('should load a page that lists the competencies in the database with their titles and descriptions.', async () => {
    mockQuery(
      'select `id`, `label`, `description` from `competencies` limit ? offset ?',
      [10, 10],
      [{ id: 1, label: 'Code', description: 'To code or not to code...' }]
    );
    expect(await listCompetencies(10, 10)).toEqual([
      {
        id: 1,
        label: 'Code',
        description: 'To code or not to code...',
      },
    ]);
  });
});
