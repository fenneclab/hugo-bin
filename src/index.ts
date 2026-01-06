import logSymbols from "log-symbols";
import install from "./lib/install";
import { doesBinExist, getBinPath } from "./lib/utils";

const hugo = async (): Promise<string> => {
  const bin = getBinPath();

  // A fix for fleeting ENOENT errors, where Hugo seems to disappear. For now,
  // just reinstall Hugo when it's missing and then continue normally like
  // nothing happened.
  // See: https://github.com/jakejarvis/hugo-extended/issues/81
  if (!doesBinExist(bin)) {
    // Hugo isn't there for some reason. Try re-installing.
    console.info(`${logSymbols.info} Hugo is missing, reinstalling now...`);
    await install();
  }

  return bin;
};

// The only thing this module really exports is the absolute path to Hugo:
export default hugo;
