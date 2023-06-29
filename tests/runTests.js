/**
 * A file to mock testing of an application
 *
 */

function runTests() {
  console.log("Starting tests");

  const testsPass = false;

  if (testsPass) {
    console.log("Tests passed!");
    process.exit(0);
  } else {
    console.log("Tests failed!");
    process.exit(1);
  }
}

runTests();
