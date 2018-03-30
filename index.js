const commander = require("commander");
const inquirer = require("inquirer");
const findSalesTax = require("./src/findSalesTax");
const createCachedFunction = require("./src/createCachedFunction");
const benchmark = require("./src/benchmark");

const fast_rate_lookup = createCachedFunction(findSalesTax);

const prompt = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "address",
      message: "Enter address:"
    }
  ]);
  console.log(`Looking up tax for ${answers.address}`);
  const tax = fast_rate_lookup(answers.address);
  console.log(`Tax: ${tax}`);
  await prompt();
};

commander.option("-b --benchmark", "Run benchmarks").parse(process.argv);

if (commander.benchmark) {
  console.log("Running benchmarks...");
  benchmark();
} else {
  prompt();
}
