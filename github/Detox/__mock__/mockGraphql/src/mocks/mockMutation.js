const faker = require('faker');

const sampleMutation = `
mutation UpdateUser{
    updateUser(updateUserInput: {
      gender: MALE,
      email:"test@mail.com",
      dob: "",
      userStatus:ACTIVE
    }) {
  
      userDto {
        lastName
        roleName
        profilePhoto
        email
        gender
        firstName
      }
    }
  }
`;

const updateUser = (parent, args, context, info) => {
  const {email} = args;
  console.log('updateUser: args', args);
  return {
    userDto: {
      email: faker.email,
      gender: faker.gender,
      profilePhoto: faker.image.avatar,
    },
  };
};

const Mutation = () => ({
  updateUser,
});

module.exports = Mutation;
