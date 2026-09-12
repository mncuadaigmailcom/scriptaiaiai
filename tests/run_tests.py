#!/usr/bin/env python3
"""Offline tests against the actual embedded Luau implementation in script.js.

Needs the official Luau CLI; never contacts GitHub or executes imported scripts.
Generated harnesses live in a temporary directory, not in the checkout.
"""
import argparse
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import textwrap

ROOT = Path(__file__).resolve().parents[1]
TESTS = ROOT / "tests"


def extract(source: str, begin: str, end: str) -> str:
    start = source.index(begin)
    # Include the indentation of the marker so dedent applies consistently.
    start = source.rfind("\n", 0, start) + 1
    stop = source.index(end, start) + len(end)
    return textwrap.dedent(source[start:stop])


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--luau", default=os.environ.get("LUAU_BIN") or shutil.which("luau"))
    parser.add_argument("--compiler", default=os.environ.get("LUAU_COMPILE_BIN") or shutil.which("luau-compile"))
    args = parser.parse_args()
    if not args.luau:
        parser.error("Install the Luau CLI or pass --luau /path/to/luau")

    source = (ROOT / "script.js").read_text(encoding="utf-8")
    core = extract(source, "-- BEGIN GITHUB STORAGE CORE", "-- END GITHUB STORAGE CORE")
    codec = (TESTS / "json_helper.luau").read_text(encoding="utf-8")
    fake = (TESTS / "fake_github.luau").read_text(encoding="utf-8")
    if args.compiler:
        subprocess.run([args.compiler, "--null", str(ROOT / "script.js")], check=True)

    with tempfile.TemporaryDirectory(prefix="banana-cat-tests-") as directory:
        directory = Path(directory)
        storage = directory / "storage.luau"
        storage.write_text("\n".join((codec, core, fake, (TESTS / "github_store_spec.luau").read_text(encoding="utf-8"))), encoding="utf-8")
        subprocess.run([args.luau, str(storage)], check=True)

        if (TESTS / "roblox_mock.luau").exists():
            mock = (TESTS / "roblox_mock.luau").read_text(encoding="utf-8")
            specs = (TESTS / "hub_regression_spec.luau").read_text(encoding="utf-8")
            smoke = directory / "hub.luau"
            smoke.write_text("\n".join((
                codec, fake, mock,
                "local function InitializeHubUnderTest()", source,
                "do local function RunRegressionTests()", specs,
                "end; RunRegressionTests() end", "end; InitializeHubUnderTest()",
            )), encoding="utf-8")
            subprocess.run([args.luau, str(smoke)], check=True)

    print("\nAll offline checks passed. Roblox/executor integration still needs a real-client test.")


if __name__ == "__main__":
    main()
