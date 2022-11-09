import db from './db';

export const countProgram = async (principalId: number) => {
    const countAlias = 'total_count';
    const [count] = await db('programs')
      .count({ [countAlias]: '*' })
      .where({ principal_id: principalId });
    // console.log(count[countAlias]);
    return count[countAlias];
};

export const findProgram = async (principalId: number) => {
    const thisProgram = await db('programs')
        .select('id', 'title')
        .where({principal_id: principalId});
    return thisProgram;
}
