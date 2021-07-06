import { Buffer } from "https://deno.land/std@0.100.0/node/buffer.ts";
import {
  assert,
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { BN } from "../lib/bn.js";

Deno.test("BN.js/Constructor", () => {
  assertEquals(
    new BN(12345).toString(16),
    "3039",
    "should accept one limb number",
  );

  assertEquals(
    new BN(0x4123456).toString(16),
    "4123456",
    "should accept two-limb number",
  );

  let num = Math.pow(2, 52);
  assertEquals(
    new BN(num, 10).toString(10),
    num.toString(10),
    "should accept 52 bits of precision",
  );

  num = Math.pow(2, 53) - 1;
  assertEquals(
    new BN(num, 10).toString(10),
    num.toString(10),
    "should accept max safe integer",
  );

  num = Math.pow(2, 53);

  assertThrows(
    function () {
      return new BN(num, 10);
    },
    Error,
    "Assertion failed",
    "should not accept an unsafe integer",
  );

  assertEquals(
    new BN(0x4123456, null, "le").toString(16),
    "56341204",
    "should accept two-limb LE number",
  );

  assertEquals(
    new BN("1A6B765D8CDF", 16).toString(16),
    "1a6b765d8cdf",
    "should accept base-16",
  );
  assertEquals(
    new BN("1A6B765D8CDF", 16).toString(),
    "29048849665247",
    "should accept base-16",
  );

  assertEquals(new BN("FF", "hex").toString(), "255", "should accept base-hex");

  num = "a89c e5af8724 c0a23e0e 0ff77500";
  assertEquals(
    new BN(num, 16).toString(16),
    num.replace(/ /g, ""),
    "should accept base-16 with spaces",
  );

  num = "123456789abcdef123456789abcdef123456789abcdef";
  assertEquals(new BN(num, 16).toString(16), num, "should accept long base-16");

  assertEquals(
    new BN("10654321").toString(),
    "10654321",
    "should accept positive base-10",
  );
  assertEquals(
    new BN("29048849665247").toString(16),
    "1a6b765d8cdf",
    "should accept positive base-10",
  );

  assertEquals(
    new BN("-29048849665247").toString(16),
    "-1a6b765d8cdf",
    "should accept negative base-10",
  );

  num = "10000000000000000";
  assertEquals(new BN(num).toString(10), num, "should accept long base-10");

  const base2 = "11111111111111111111111111111111111111111111111111111";
  assertEquals(new BN(base2, 2).toString(2), base2, "should accept base-2");

  const base36 = "zzZzzzZzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz";
  assertEquals(
    new BN(base36, 36).toString(36),
    base36.toLowerCase(),
    "should accept base-36",
  );

  num = "65820182292848241686198767302293" + "20890292528855852623664389292032";
  assert(
    new BN(num).words[0] < 0x4000000,
    "should not overflow limbs during base-10",
  );

  assertEquals(
    new BN("1A6B765D8CDF", 16, "le").toString(16),
    "df8c5d766b1a",
    "should accept base-16 LE integer",
  );

  assertEquals(
    new BN("0010", 16, "le").toNumber(),
    4096,
    "should accept base-16 LE integer with leading zeros",
  );
  assertEquals(
    new BN("-010", 16, "le").toNumber(),
    -4096,
    "should accept base-16 LE integer with leading zeros",
  );
  assertEquals(
    new BN("010", 16, "le").toNumber(),
    4096,
    "should accept base-16 LE integer with leading zeros",
  );

  assertThrows(
    function () {
      return new BN("01FF");
    },
    Error,
    "Invalid character",
  );

  assertThrows(
    function () {
      return new BN("01FF");
    },
    Error,
    "Invalid character",
    "should not accept wrong characters for base",
  );

  assertThrows(
    function () {
      new BN("10.00", 10);
    },
    Error,
    "Invalid character",
    "should not accept decimal",
  );

  assertThrows(
    function () {
      new BN("16.00", 16);
    },
    Error,
    "Invalid character",
    "should not accept decimal",
  );

  [
    "0000000z",
    "000000gg",
    "0000gg00",
    "fffggfff",
    "/0000000",
    "0-000000", // if -, is first, that is OK
    "ff.fffff",
    "hexadecimal",
  ].forEach(function (str) {
    assertThrows(
      function () {
        new BN(str, 16); // eslint-disable-line no-new
      },
      Error,
      "Invalid character in ",
      "should not accept non-hex characters",
    );
  });

  assertEquals(new BN([]).toString(16), "0", "should not fail on empty array");

  assertEquals(
    new BN([0, 1], 16).toString(16),
    "1",
    "should import/export big endian",
  );
  assertEquals(
    new BN([1, 2, 3]).toString(16),
    "10203",
    "should import/export big endian",
  );
  assertEquals(
    new BN([1, 2, 3, 4]).toString(16),
    "1020304",
    "should import/export big endian",
  );
  assertEquals(
    new BN([1, 2, 3, 4, 5]).toString(16),
    "102030405",
    "should import/export big endian",
  );
  assertEquals(
    new BN([1, 2, 3, 4, 5, 6, 7, 8]).toString(16),
    "102030405060708",
    "should import/export big endian",
  );
  assertEquals(
    new BN([1, 2, 3, 4]).toArray().join(","),
    "1,2,3,4",
    "should import/export big endian",
  );
  assertEquals(
    new BN([1, 2, 3, 4, 5, 6, 7, 8]).toArray().join(","),
    "1,2,3,4,5,6,7,8",
    "should import/export big endian",
  );

  assertEquals(
    new BN([0, 1], 16, "le").toString(16),
    "100",
    "should import little endian",
  );
  assertEquals(
    new BN([1, 2, 3], 16, "le").toString(16),
    "30201",
    "should import little endian",
  );
  assertEquals(
    new BN([1, 2, 3, 4], 16, "le").toString(16),
    "4030201",
    "should import little endian",
  );
  assertEquals(
    new BN([1, 2, 3, 4, 5], 16, "le").toString(16),
    "504030201",
    "should import little endian",
  );
  assertEquals(
    new BN([1, 2, 3, 4, 5, 6, 7, 8], "le").toString(16),
    "807060504030201",
    "should import little endian",
  );
  assertEquals(
    new BN([1, 2, 3, 4]).toArray("le").join(","),
    "4,3,2,1",
    "should import little endian",
  );
  assertEquals(
    new BN([1, 2, 3, 4, 5, 6, 7, 8]).toArray("le").join(","),
    "8,7,6,5,4,3,2,1",
    "should import little endian",
  );

  assertEquals(
    new BN([1, 2, 3, 4, 5], "le").toString(16),
    "504030201",
    "should import big endian with implicit base",
  );

  assertEquals(new BN(Buffer.alloc(0)).toString(16), "0", "with Buffer input");

  assertEquals(
    new BN(Buffer.from("010203", "hex")).toString(16),
    "10203",
    "should import/export big endian"
  );

  assertEquals(
    new BN(Buffer.from("010203", "hex"), "le").toString(16),
    "30201",
    "should import little endian"
  );

  num = new BN(12345);
  assertEquals(new BN(num).toString(10), "12345", "should clone BN");
});
