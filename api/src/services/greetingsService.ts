import db from './db';

export const findGreeting = async (principalId: number) => {
  console.log("findGreeting");
  const greeting = await db('greetings')
  .select('id', 'principal_id')
  .where({ principal_id: principalId });
  console.log("service" + greeting);
return greeting || null;


};

export const createGreeting =async (principalId: number) => {
  console.log("createGreeting");
  const greeting: {
    id?: number;
    principal_id?: number;
  } = { principal_id: principalId };

    const [insertedGreetingIds] = await db('greetings').insert(greeting);
    const greetingId = insertedGreetingIds;
    greeting.id = greetingId;
  console.log("create" + greeting);
  return greeting;
};
