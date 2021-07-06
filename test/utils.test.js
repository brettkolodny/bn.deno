import { Buffer } from "https://deno.land/std@0.100.0/node/buffer.ts";

import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { BN } from "../lib/bn.js";

Deno.test("BN.js/Utils", () => {
  let a = new BN(0);

  assertEquals(a.toString(2, 256).length, 256, "should have a length of 256");

  a = new BN("ffb9602", 16);

  assertEquals(
    a.toString("hex", 2).length,
    8,
    "should have length of 8 from leading 15",
  );

  a = new BN("fb9604", 16);

  assertEquals(
    a.toString("hex", 8).length,
    8,
    "should have length of 8 from leading zero",
  );

  a = new BN(0);

  assertEquals(
    a.toString("hex", 8).length,
    8,
    "should have length of 8 from leading zeros",
  );

  a = new BN(
    "ffb96ff654e61130ba8422f0debca77a0ea74ae5ea8bca9b54ab64aabf01003",
    16,
  );

  assertEquals(
    a.toString("hex", 2).length,
    64,
    "should have length of 64 from leading 15",
  );

  a = new BN(
    "fb96ff654e61130ba8422f0debca77a0ea74ae5ea8bca9b54ab64aabf01003",
    16,
  );

  assertEquals(
    a.toString("hex", 64).length,
    64,
    "should have length of 64 from leading zero",
  );

  assertEquals(
    new BN(-1).isNeg(),
    true,
    "should return true for negative numbers",
  );
  assertEquals(
    new BN(1).isNeg(),
    false,
    "should return true for negative numbers",
  );
  assertEquals(
    new BN(0).isNeg(),
    false,
    "should return true for negative numbers",
  );
  assertEquals(
    new BN("-0", 10).isNeg(),
    false,
    "should return true for negative numbers",
  );

  assertEquals(new BN(0).isOdd(), false, "should return true for odd numbers");
  assertEquals(new BN(1).isOdd(), true, "should return true for odd numbers");
  assertEquals(new BN(2).isOdd(), false, "should return true for odd numbers");
  assertEquals(
    new BN("-0", 10).isOdd(),
    false,
    "should return true for odd numbers",
  );
  assertEquals(
    new BN("-1", 10).isOdd(),
    true,
    "should return true for odd numbers",
  );
  assertEquals(
    new BN("-2", 10).isOdd(),
    false,
    "should return true for odd numbers",
  );

  assertEquals(new BN(0).isEven(), true, "should return true for even numbers");
  assertEquals(
    new BN(1).isEven(),
    false,
    "should return true for even numbers",
  );
  assertEquals(new BN(2).isEven(), true, "should return true for even numbers");
  assertEquals(
    new BN("-0", 10).isEven(),
    true,
    "should return true for even numbers",
  );
  assertEquals(
    new BN("-1", 10).isEven(),
    false,
    "should return true for even numbers",
  );
  assertEquals(
    new BN("-2", 10).isEven(),
    true,
    "should return true for even numbers",
  );

  assertEquals(new BN(0).isZero(), true, "should return true for zero");
  assertEquals(new BN(1).isZero(), false, "should return true for zero");
  assertEquals(
    new BN(0xffffffff).isZero(),
    false,
    "should return true for zero",
  );

  assertEquals(new BN(0).bitLength(), 0, "should return proper bitLength");
  assertEquals(new BN(0x1).bitLength(), 1, "should return proper bitLength");
  assertEquals(new BN(0x2).bitLength(), 2, "should return proper bitLength");
  assertEquals(new BN(0x3).bitLength(), 2, "should return proper bitLength");
  assertEquals(new BN(0x4).bitLength(), 3, "should return proper bitLength");
  assertEquals(new BN(0x8).bitLength(), 4, "should return proper bitLength");
  assertEquals(new BN(0x10).bitLength(), 5, "should return proper bitLength");
  assertEquals(new BN(0x100).bitLength(), 9, "should return proper bitLength");
  assertEquals(
    new BN(0x123456).bitLength(),
    21,
    "should return proper bitLength",
  );
  assertEquals(
    new BN("123456789", 16).bitLength(),
    33,
    "should return proper bitLength",
  );
  assertEquals(
    new BN("8023456789", 16).bitLength(),
    40,
    "should return proper bitLength",
  );

  let n = new BN(0);
  assertEquals(n.toArray("be"), [0], "should return [ 0 ] for `0`");
  assertEquals(n.toArray("le"), [0], "should return [ 0 ] for `0`");

  n = new BN(0x123456);
  assertEquals(
    n.toArray("be", 5),
    [0x00, 0x00, 0x12, 0x34, 0x56],
    "should zero pad to desired lengths",
  );
  assertEquals(
    n.toArray("le", 5),
    [0x56, 0x34, 0x12, 0x00, 0x00],
    "should zero pad to desired lengths",
  );

  n = new BN(0x123456);
  assertEquals(n.toBuffer("be", 5).toString("hex"), "0000123456");
  assertEquals(n.toBuffer("le", 5).toString("hex"), "5634120000");

  const s = "211e1566be78319bb949470577c2d4ac7e800a90d5104379478d8039451a8efe";
  for (let i = 1; i <= s.length; i++) {
    const slice = (i % 2 === 0 ? "" : "0") + s.slice(0, i);
    const bn = new BN(slice, 16);
    assertEquals(bn.toBuffer("be").toString("hex"), slice);
    assertEquals(
      bn.toBuffer("le").toString("hex"),
      Buffer.from(slice, "hex").reverse().toString("hex"),
    );
  }

  n = new BN(0x123456);
  assertThrows(
    function () {
      n.toArray("be", 2);
    },
    Error,
    "byte array longer than desired length",
  );

  assertEquals(
    new BN(0x123456).toNumber(),
    0x123456,
    "should return proper Number if below the limit",
  );
  assertEquals(
    new BN(0x3ffffff).toNumber(),
    0x3ffffff,
    "should return proper Number if below the limit",
  );
  assertEquals(
    new BN(0x4000000).toNumber(),
    0x4000000,
    "should return proper Number if below the limit",
  );
  assertEquals(
    new BN(0x10000000000000).toNumber(),
    0x10000000000000,
    "should return proper Number if below the limit",
  );
  assertEquals(
    new BN(0x10040004004000).toNumber(),
    0x10040004004000,
    "should return proper Number if below the limit",
  );
  assertEquals(
    new BN(-0x123456).toNumber(),
    -0x123456,
    "should return proper Number if below the limit",
  );
  assertEquals(
    new BN(-0x3ffffff).toNumber(),
    -0x3ffffff,
    "should return proper Number if below the limit",
  );
  assertEquals(
    new BN(-0x4000000).toNumber(),
    -0x4000000,
    "should return proper Number if below the limit",
  );
  assertEquals(
    new BN(-0x10000000000000).toNumber(),
    -0x10000000000000,
    "should return proper Number if below the limit",
  );
  assertEquals(
    new BN(-0x10040004004000).toNumber(),
    -0x10040004004000,
    "should return proper Number if below the limit",
  );

  n = new BN(1).iushln(54);
  assertThrows(
    function () {
      n.toNumber();
    },
    Error,
    "Number can only safely store up to 53 bits",
    "should throw when number exceeds 53 bits",
  );

  assertEquals(new BN(0).zeroBits(), 0, "should return proper zeroBits");
  assertEquals(new BN(0x1).zeroBits(), 0, "should return proper zeroBits");
  assertEquals(new BN(0x2).zeroBits(), 1, "should return proper zeroBits");
  assertEquals(new BN(0x3).zeroBits(), 0, "should return proper zeroBits");
  assertEquals(new BN(0x4).zeroBits(), 2, "should return proper zeroBits");
  assertEquals(new BN(0x8).zeroBits(), 3, "should return proper zeroBits");
  assertEquals(new BN(0x10).zeroBits(), 4, "should return proper zeroBits");
  assertEquals(new BN(0x100).zeroBits(), 8, "should return proper zeroBits");
  assertEquals(
    new BN(0x1000000).zeroBits(),
    24,
    "should return proper zeroBits",
  );
  assertEquals(new BN(0x123456).zeroBits(), 1, "should return proper zeroBits");

  assertEquals(new BN(0x123).toJSON(), "0123", "should return hex string");

  assertEquals(
    new BN(0x1).toJSON(),
    "01",
    "should be padded to multiple of 2 bytes for interop",
  );

  assertEquals(new BN(42).cmpn(42), 0, "should return -1, 0, 1 correctly");
  assertEquals(new BN(42).cmpn(43), -1, "should return -1, 0, 1 correctly");
  assertEquals(new BN(42).cmpn(41), 1, "should return -1, 0, 1 correctly");
  assertEquals(
    new BN(0x3fffffe).cmpn(0x3fffffe),
    0,
    "should return -1, 0, 1 correctly",
  );
  assertEquals(
    new BN(0x3fffffe).cmpn(0x3ffffff),
    -1,
    "should return -1, 0, 1 correctly",
  );
  assertEquals(
    new BN(0x3fffffe).cmpn(0x3fffffd),
    1,
    "should return -1, 0, 1 correctly",
  );
  assertThrows(
    function () {
      new BN(0x3fffffe).cmpn(0x4000000);
    },
    Error,
    "Number is too big",
    "should return -1, 0, 1 correctly",
  );
  assertEquals(new BN(42).cmpn(-42), 1, "should return -1, 0, 1 correctly");
  assertEquals(new BN(-42).cmpn(42), -1, "should return -1, 0, 1 correctly");
  assertEquals(new BN(-42).cmpn(-42), 0, "should return -1, 0, 1 correctly");
  assertEquals(
    1 / new BN(-42).cmpn(-42),
    Infinity,
    "should return -1, 0, 1 correctly",
  );

  assertEquals(
    new BN(42).cmp(new BN(42)),
    0,
    "should return -1, 0, 1 correctly",
  );
  assertEquals(
    new BN(42).cmp(new BN(43)),
    -1,
    "should return -1, 0, 1 correctly",
  );
  assertEquals(
    new BN(42).cmp(new BN(41)),
    1,
    "should return -1, 0, 1 correctly",
  );
  assertEquals(
    new BN(0x3fffffe).cmp(new BN(0x3fffffe)),
    0,
    "should return -1, 0, 1 correctly",
  );
  assertEquals(
    new BN(0x3fffffe).cmp(new BN(0x3ffffff)),
    -1,
    "should return -1, 0, 1 correctly",
  );
  assertEquals(
    new BN(0x3fffffe).cmp(new BN(0x3fffffd)),
    1,
    "should return -1, 0, 1 correctly",
  );
  assertEquals(
    new BN(0x3fffffe).cmp(new BN(0x4000000)),
    -1,
    "should return -1, 0, 1 correctly",
  );
  assertEquals(
    new BN(42).cmp(new BN(-42)),
    1,
    "should return -1, 0, 1 correctly",
  );
  assertEquals(
    new BN(-42).cmp(new BN(42)),
    -1,
    "should return -1, 0, 1 correctly",
  );
  assertEquals(
    new BN(-42).cmp(new BN(-42)),
    0,
    "should return -1, 0, 1 correctly",
  );
  assertEquals(
    1 / new BN(-42).cmp(new BN(-42)),
    Infinity,
    "should return -1, 0, 1 correctly",
  );

  assertEquals(new BN(3).gtn(2), true, ".gtn greater than");
  assertEquals(new BN(3).gtn(3), false, ".gtn greater than");
  assertEquals(new BN(3).gtn(4), false, ".gtn greater than");

  assertEquals(new BN(3).gt(new BN(2)), true, ".gt greater than");
  assertEquals(new BN(3).gt(new BN(3)), false, ".gt greater than");
  assertEquals(new BN(3).gt(new BN(4)), false, ".gt greater than");

  assertEquals(new BN(3).gten(3), true, ".gten greater than or equal");
  assertEquals(new BN(3).gten(2), true, ".gten greater than or equal");
  assertEquals(new BN(3).gten(4), false, ".gten greater than or equal");

  assertEquals(new BN(3).gte(new BN(3)), true, ".gte greater than or equal");
  assertEquals(new BN(3).gte(new BN(2)), true, ".gte greater than or equal");
  assertEquals(new BN(3).gte(new BN(4)), false, ".gte greater than or equal");

  assertEquals(new BN(2).ltn(3), true, ".ltn less than");
  assertEquals(new BN(2).ltn(2), false, ".ltn less than");
  assertEquals(new BN(2).ltn(1), false, ".ltn less than");

  assertEquals(new BN(2).lt(new BN(3)), true, ".lt less than");
  assertEquals(new BN(2).lt(new BN(2)), false, ".lt less than");
  assertEquals(new BN(2).lt(new BN(1)), false, ".lt less than");

  assertEquals(new BN(3).lten(3), true, ".lten less than or equal");
  assertEquals(new BN(3).lten(2), false, ".lten less than or equal");
  assertEquals(new BN(3).lten(4), true, ".lten less than or equal");

  assertEquals(new BN(3).lte(new BN(3)), true, ".lte less than or equal");
  assertEquals(new BN(3).lte(new BN(2)), false, ".lte less than or equal");
  assertEquals(new BN(3).lte(new BN(4)), true, ".lte less than or equal");

  assertEquals(new BN(3).eqn(3), true, ".eqn equal");
  assertEquals(new BN(3).eqn(2), false, ".eqn equal");
  assertEquals(new BN(3).eqn(4), false, ".eqn equal");

  assertEquals(new BN(3).eq(new BN(3)), true, ".eq equal");
  assertEquals(new BN(3).eq(new BN(2)), false, ".eq equal");
  assertEquals(new BN(3).eq(new BN(4)), false, ".eq equal");

  assertEquals(
    new BN("00000000", 16).fromTwos(32).toNumber(),
    0,
    "should convert from two's complement to negative number",
  );
  assertEquals(
    new BN("00000001", 16).fromTwos(32).toNumber(),
    1,
    "should convert from two's complement to negative number",
  );
  assertEquals(
    new BN("7fffffff", 16).fromTwos(32).toNumber(),
    2147483647,
    "should convert from two's complement to negative number",
  );
  assertEquals(
    new BN("80000000", 16).fromTwos(32).toNumber(),
    -2147483648,
    "should convert from two's complement to negative number",
  );
  assertEquals(
    new BN("f0000000", 16).fromTwos(32).toNumber(),
    -268435456,
    "should convert from two's complement to negative number",
  );
  assertEquals(
    new BN("f1234567", 16).fromTwos(32).toNumber(),
    -249346713,
    "should convert from two's complement to negative number",
  );
  assertEquals(
    new BN("ffffffff", 16).fromTwos(32).toNumber(),
    -1,
    "should convert from two's complement to negative number",
  );
  assertEquals(
    new BN("fffffffe", 16).fromTwos(32).toNumber(),
    -2,
    "should convert from two's complement to negative number",
  );
  assertEquals(
    new BN("fffffffffffffffffffffffffffffffe", 16).fromTwos(128).toNumber(),
    -2,
    "should convert from two's complement to negative number",
  );
  assertEquals(
    new BN(
      "ffffffffffffffffffffffffffffffff" + "fffffffffffffffffffffffffffffffe",
      16,
    )
      .fromTwos(256)
      .toNumber(),
    -2,
    "should convert from two's complement to negative number",
  );
  assertEquals(
    new BN(
      "ffffffffffffffffffffffffffffffff" + "ffffffffffffffffffffffffffffffff",
      16,
    )
      .fromTwos(256)
      .toNumber(),
    -1,
    "should convert from two's complement to negative number",
  );
  assertEquals(
    new BN(
      "7fffffffffffffffffffffffffffffff" + "ffffffffffffffffffffffffffffffff",
      16,
    )
      .fromTwos(256)
      .toString(10),
    new BN(
      "5789604461865809771178549250434395392663499" +
        "2332820282019728792003956564819967",
      10,
    ).toString(10),
    "should convert from two's complement to negative number",
  );
  assertEquals(
    new BN(
      "80000000000000000000000000000000" + "00000000000000000000000000000000",
      16,
    )
      .fromTwos(256)
      .toString(10),
    new BN(
      "-578960446186580977117854925043439539266349" +
        "92332820282019728792003956564819968",
      10,
    ).toString(10),
    "should convert from two's complement to negative number",
  );

  assertEquals(
    new BN(0).toTwos(32).toString(16),
    "0",
    "should convert from negative number to two's complement",
  );
  assertEquals(
    new BN(1).toTwos(32).toString(16),
    "1",
    "should convert from negative number to two's complement",
  );
  assertEquals(
    new BN(2147483647).toTwos(32).toString(16),
    "7fffffff",
    "should convert from negative number to two's complement",
  );
  assertEquals(
    new BN("-2147483648", 10).toTwos(32).toString(16),
    "80000000",
    "should convert from negative number to two's complement",
  );
  assertEquals(
    new BN("-268435456", 10).toTwos(32).toString(16),
    "f0000000",
    "should convert from negative number to two's complement",
  );
  assertEquals(
    new BN("-249346713", 10).toTwos(32).toString(16),
    "f1234567",
    "should convert from negative number to two's complement",
  );
  assertEquals(
    new BN("-1", 10).toTwos(32).toString(16),
    "ffffffff",
    "should convert from negative number to two's complement",
  );
  assertEquals(
    new BN("-2", 10).toTwos(32).toString(16),
    "fffffffe",
    "should convert from negative number to two's complement",
  );
  assertEquals(
    new BN("-2", 10).toTwos(128).toString(16),
    "fffffffffffffffffffffffffffffffe",
    "should convert from negative number to two's complement",
  );
  assertEquals(
    new BN("-2", 10).toTwos(256).toString(16),
    "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe",
    "should convert from negative number to two's complement",
  );
  assertEquals(
    new BN("-1", 10).toTwos(256).toString(16),
    "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    "should convert from negative number to two's complement",
  );
  assertEquals(
    new BN(
      "5789604461865809771178549250434395392663" +
        "4992332820282019728792003956564819967",
      10,
    )
      .toTwos(256)
      .toString(16),
    "7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    "should convert from negative number to two's complement",
  );
  assertEquals(
    new BN(
      "-578960446186580977117854925043439539266" +
        "34992332820282019728792003956564819968",
      10,
    )
      .toTwos(256)
      .toString(16),
    "8000000000000000000000000000000000000000000000000000000000000000",
    "should convert from negative number to two's complement",
  );

  assertEquals(BN.isBN(new BN()), true, ".isBN");

  assertEquals(BN.isBN(1), false, "should return false for everything else");
  assertEquals(BN.isBN([]), false, "should return false for everything else");
  assertEquals(BN.isBN({}), false, "should return false for everything else");
});
