import { getRowsfromAllUsers } from "../functionToDB.js";
jest.mock("../functionToDB.js");

describe("Get Users", () => {
  it("Array is good", async () => {
    const response = await getRowsfromAllUsers("email username image");

    expect(response).toBe([]);
  });
});
