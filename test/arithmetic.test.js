import {
  assertEquals,
  assertThrows,
} from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { BN } from "../lib/bn.js";
import * as fixtures from "./fixtures.js";

Deno.test(".add()", () => {
  assertEquals(
    new BN(14).add(new BN(26)).toString(16),
    "28",
    "should add numbers",
  );
  let k = new BN(0x1234);
  let r = k;

  for (let i = 0; i < 257; i++) {
    r = r.add(k);
  }

  assertEquals(r.toString(16), "125868", "should add numbers");

  k = new BN("abcdefabcdefabcdef", 16);
  r = new BN("deadbeef", 16);

  for (let i = 0; i < 257; i++) {
    r.iadd(k);
  }

  assertEquals(
    r.toString(16),
    "ac79bd9b79be7a277bde",
    "should handle carry properly (in-place)",
  );

  var a = new BN("abcd", 16);
  var b = new BN("-abce", 16);

  assertEquals(
    a.iadd(b).toString(16),
    "-1",
    "should properly do positive + negative",
  );

  a = new BN("abcd", 16);
  b = new BN("-abce", 16);

  assertEquals(
    a.add(b).toString(16),
    "-1",
    "should properly do positive + negative",
  );
  assertEquals(
    b.add(a).toString(16),
    "-1",
    "should properly do positive + negative",
  );
});

Deno.test(".iaddn()", () => {
  let a = new BN(-100);
  assertEquals(a.negative, 1, "should allow a sign change");

  a.iaddn(200);

  assertEquals(a.negative, 0, "should allow a sign change");
  assertEquals(a.toString(), "100", "should allow a sign change");

  a = new BN(-100);
  assertEquals(a.negative, 1, "should add negative number");

  a.iaddn(-200);

  assertEquals(a.toString(), "-300", "should add negative number");

  a = new BN("-1000000000", 10);
  assertEquals(a.negative, 1);

  a.iaddn(200);

  assertEquals(a.toString(), "-999999800");

  a = new BN("3ffffff", 16);

  assertEquals(a.iaddn(1).toString(16), "4000000", "should carry limb");

  assertThrows(
    function () {
      new BN(0).iaddn(0x4000000);
    },
    Error,
    "Assertion failed",
    "should throw error with num eq 0x4000000",
  );

  a = new BN(-1);
  assertEquals(
    a.addn(1).toString(),
    "0",
    "should reset sign if value equal to value in instance",
  );
});

Deno.test(".sub()", () => {
  assertEquals(
    new BN(26).sub(new BN(14)).toString(16),
    "c",
    "should subtract small numbers",
  );
  assertEquals(
    new BN(14).sub(new BN(26)).toString(16),
    "-c",
    "should subtract small numbers",
  );
  assertEquals(
    new BN(26).sub(new BN(26)).toString(16),
    "0",
    "should subtract small numbers",
  );
  assertEquals(
    new BN(-26).sub(new BN(26)).toString(16),
    "-34",
    "should subtract small numbers",
  );

  let a = new BN(
    "31ff3c61db2db84b9823d320907a573f6ad37c437abe458b1802cda041d6384" +
      "a7d8daef41395491e2",
    16,
  );
  let b = new BN(
    "6f0e4d9f1d6071c183677f601af9305721c91d31b0bbbae8fb790000",
    16,
  );
  const r = new BN(
    "31ff3c61db2db84b9823d3208989726578fd75276287cd9516533a9acfb9a67" +
      "76281f34583ddb91e2",
    16,
  );

  assertEquals(a.sub(b).cmp(r), 0, "should subtract big numbers");

  assertEquals(
    b.clone().isub(a).neg().cmp(r),
    0,
    "should subtract numbers in place",
  );

  // Carry and copy
  a = new BN("12345", 16);
  b = new BN("1000000000000", 16);
  assertEquals(
    a.isub(b).toString(16),
    "-fffffffedcbb",
    "should subtract with carry",
  );

  a = new BN("12345", 16);
  b = new BN("1000000000000", 16);
  assertEquals(
    b.isub(a).toString(16),
    "fffffffedcbb",
    "should subtract with carry",
  );
});

Deno.test(".isubn", () => {
  var r = new BN(
    "7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b",
    16,
  );
  assertEquals(
    r.isubn(-1).toString(16),
    "7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681c",
    "should subtract negative number",
  );

  var a = new BN(-100);
  assertEquals(a.negative, 1, "should work for positive numbers");

  a.isubn(200);
  assertEquals(a.negative, 1, "should work for positive numbers");
  assertEquals(a.toString(), "-300", "should work for positive numbers");

  a = new BN(-100);
  assertEquals(a.negative, 1, "should not allow a sign change");

  a.isubn(-200);
  assertEquals(a.negative, 0, "should not allow a sign change");
  assertEquals(a.toString(), "100", "should not allow a sign change");

  a = new BN(0).subn(2);
  assertEquals(a.toString(), "-2", "should change sign on small numbers at 0");

  a = new BN(1).subn(2);
  assertEquals(a.toString(), "-1", "should change sign on small numbers at 1");

  assertThrows(
    function () {
      new BN(0).isubn(0x4000000);
    },
    Error,
    "Assertion failed",
    "should throw error with num eq 0x4000000",
  );
});

Deno.test(".mul()", () => {
  testMethod((x, y) => {
    return BN.prototype.mul.apply(x, [y]);
  });
});

Deno.test(".mulf()", () => {
  testMethod((x, y) => {
    return BN.prototype.mul.apply(x, [y]);
  });
});

function testMethod(mul) {
  var offsets = [
    1, // smallMulTo
    250, // comb10MulTo
    1000, // bigMulTo
    15000, // jumboMulTo
  ];

  for (let i = 0; i < offsets.length; ++i) {
    const x = new BN(1).ishln(offsets[i]);

    assertEquals(
      mul(x, x).isNeg(),
      false,
      "should multiply numbers of different signs",
    );
    assertEquals(
      mul(x, x.neg()).isNeg(),
      true,
      "should multiply numbers of different signs",
    );
    assertEquals(
      mul(x.neg(), x).isNeg(),
      true,
      "should multiply numbers of different signs",
    );
    assertEquals(
      mul(x.neg(), x.neg()).isNeg(),
      false,
      "should multiply numbers of different signs",
    );
  }

  var n = new BN(0x1001);
  var r = n;

  for (let i = 0; i < 4; i++) {
    r = mul(r, n);
  }

  assertEquals(
    r.toString(16),
    "100500a00a005001",
    "should multiply with carry",
  );

  n = new BN(
    "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
    16,
  );
  assertEquals(
    mul(n, n).toString(16),
    "39e58a8055b6fb264b75ec8c646509784204ac15a8c24e05babc9729ab9" +
      "b055c3a9458e4ce3289560a38e08ba8175a9446ce14e608245ab3a9" +
      "978a8bd8acaa40",
    "should correctly multiply big numbers",
  );
  assertEquals(
    mul(mul(n, n), n).toString(16),
    "1b888e01a06e974017a28a5b4da436169761c9730b7aeedf75fc60f687b" +
      "46e0cf2cb11667f795d5569482640fe5f628939467a01a612b02350" +
      "0d0161e9730279a7561043af6197798e41b7432458463e64fa81158" +
      "907322dc330562697d0d600",
    "should correctly multiply big numbers",
  );

  assertEquals(
    mul(new BN("-100000000000"), new BN("3").div(new BN("4")))
      .toString(16),
    "0",
    "should multiply neg number on 0",
  );

  var q = fixtures.dhGroups.p17.q;
  var qs = fixtures.dhGroups.p17.qs;

  q = new BN(q, 16);
  assertEquals(mul(q, q).toString(16), qs, "should regress mul big numbers");
}

Deno.test(".imul()", () => {
  var a = new BN("abcdef01234567890abcd", 16);
  var b = new BN("deadbeefa551edebabba8", 16);
  var c = a.mul(b);

  assertEquals(
    a.imul(b).toString(16),
    c.toString(16),
    "should multiply numbers in-place",
  );

  a = new BN("abcdef01234567890abcd214a25123f512361e6d236", 16);
  b = new BN("deadbeefa551edebabba8121234fd21bac0341324dd", 16);
  c = a.mul(b);

  assertEquals(
    a.imul(b).toString(16),
    c.toString(16),
    "should multiply numbers in-place",
  );

  a = new BN("abcdef01234567890abcd", 16);
  b = new BN("0", 16);
  c = a.mul(b);

  assertEquals(a.imul(b).toString(16), c.toString(16), "should multiply by 0");

  var q = fixtures.dhGroups.p17.q;
  var qs = fixtures.dhGroups.p17.qs;

  q = new BN(q, 16);

  assertEquals(
    q.isqr().toString(16),
    qs,
    "should regress mul big numbers in-place",
  );
});

Deno.test(".muln()", () => {
  var a = new BN("abcdef01234567890abcd", 16);
  var b = new BN("dead", 16);
  var c = a.mul(b);

  assertEquals(
    a.muln(0xdead).toString(16),
    c.toString(16),
    "should multiply number by small number",
  );

  assertThrows(
    function () {
      new BN(0).imuln(0x4000000);
    },
    Error,
    "Assertion failed",
    "should throw error with num eq 0x4000000",
  );

  a = new BN("dead", 16);
  assertEquals(a.clone().imuln(-1).toString(16), a.clone().neg().toString(16));
  assertEquals(a.clone().muln(-1).toString(16), a.clone().neg().toString(16));

  b = new BN("dead", 16);
  assertEquals(
    b.clone().imuln(-42).toString(16),
    b.clone().neg().muln(42).toString(16),
  );
  assertEquals(
    b.clone().muln(-42).toString(16),
    b.clone().neg().muln(42).toString(16),
  );
});

Deno.test(".pow()", () => {
  var a = new BN("ab", 16);
  var b = new BN("13", 10);
  var c = a.pow(b);

  assertEquals(
    c.toString(16),
    "15963da06977df51909c9ba5b",
    "should raise number to the power",
  );
});

Deno.test(".div()", () => {
  assertEquals(
    new BN("256").div(new BN(10)).toString(10),
    "25",
    "should divide small numbers (<=26 bits)",
  );
  assertEquals(
    new BN("-256").div(new BN(10)).toString(10),
    "-25",
    "should divide small numbers (<=26 bits)",
  );
  assertEquals(
    new BN("256").div(new BN(-10)).toString(10),
    "-25",
    "should divide small numbers (<=26 bits)",
  );
  assertEquals(
    new BN("-256").div(new BN(-10)).toString(10),
    "25",
    "should divide small numbers (<=26 bits)",
  );

  assertEquals(
    new BN("10").div(new BN(256)).toString(10),
    "0",
    "should divide small numbers (<=26 bits)",
  );
  assertEquals(
    new BN("-10").div(new BN(256)).toString(10),
    "0",
    "should divide small numbers (<=26 bits)",
  );
  assertEquals(
    new BN("10").div(new BN(-256)).toString(10),
    "0",
    "should divide small numbers (<=26 bits)",
  );
  assertEquals(
    new BN("-10").div(new BN(-256)).toString(10),
    "0",
    "should divide small numbers (<=26 bits)",
  );

  assertEquals(
    new BN("1222222225255589").div(new BN("611111124969028"))
      .toString(10),
    "1",
    "should divide large numbers (>53 bits)",
  );
  assertEquals(
    new BN("-1222222225255589").div(new BN("611111124969028"))
      .toString(10),
    "-1",
    "should divide large numbers (>53 bits)",
  );
  assertEquals(
    new BN("1222222225255589").div(new BN("-611111124969028"))
      .toString(10),
    "-1",
    "should divide large numbers (>53 bits)",
  );
  assertEquals(
    new BN("-1222222225255589").div(new BN("-611111124969028"))
      .toString(10),
    "1",
    "should divide large numbers (>53 bits)",
  );

  assertEquals(
    new BN("611111124969028").div(new BN("1222222225255589"))
      .toString(10),
    "0",
    "should divide large numbers (>53 bits)",
  );
  assertEquals(
    new BN("-611111124969028").div(new BN("1222222225255589"))
      .toString(10),
    "0",
    "should divide large numbers (>53 bits)",
  );
  assertEquals(
    new BN("611111124969028").div(new BN("-1222222225255589"))
      .toString(10),
    "0",
    "should divide large numbers (>53 bits)",
  );
  assertEquals(
    new BN("-611111124969028").div(new BN("-1222222225255589"))
      .toString(10),
    "0",
    "should divide large numbers (>53 bits)",
  );

  assertEquals(
    new BN("69527932928").div(new BN("16974594")).toString(16),
    "fff",
    "should divide numbers",
  );
  assertEquals(
    new BN("-69527932928").div(new BN("16974594")).toString(16),
    "-fff",
    "should divide numbers",
  );

  var b = new BN(
    "39e58a8055b6fb264b75ec8c646509784204ac15a8c24e05babc9729ab9" +
      "b055c3a9458e4ce3289560a38e08ba8175a9446ce14e608245ab3a9" +
      "978a8bd8acaa40",
    16,
  );
  var n = new BN(
    "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
    16,
  );
  assertEquals(b.div(n).toString(16), n.toString(16), "should divide numbers");

  assertEquals(
    new BN("1").div(new BN("-5")).toString(10),
    "0",
    "should divide numbers",
  );

  // Regression after moving to word div
  var p = new BN(
    "fffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f",
    16,
  );
  var a = new BN(
    "79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798",
    16,
  );
  var as = a.sqr();
  assertEquals(
    as.div(p).toString(16),
    "39e58a8055b6fb264b75ec8c646509784204ac15a8c24e05babc9729e58090b9",
    "should not fail on regression after moving to _wordDiv",
  );

  p = new BN(
    "ffffffff00000001000000000000000000000000ffffffffffffffffffffffff",
    16,
  );
  a = new BN(
    "fffffffe00000003fffffffd0000000200000001fffffffe00000002ffffffff" +
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    16,
  );
  assertEquals(
    a.div(p).toString(16),
    "ffffffff00000002000000000000000000000001000000000000000000000001",
    "should not fail on regression after moving to _wordDiv",
  );
});

Deno.test("idivn()", () => {
  assertEquals(
    new BN("10", 16).idivn(3).toString(16),
    "5",
    "should divide numbers in-place",
  );
  assertEquals(
    new BN("10", 16).idivn(-3).toString(16),
    "-5",
    "should divide numbers in-place",
  );
  assertEquals(
    new BN("12", 16).idivn(3).toString(16),
    "6",
    "should divide numbers in-place",
  );
  assertEquals(
    new BN("10000000000000000").idivn(3).toString(10),
    "3333333333333333",
    "should divide numbers in-place",
  );
  assertEquals(
    new BN("100000000000000000000000000000").idivn(3).toString(10),
    "33333333333333333333333333333",
    "should divide numbers in-place",
  );

  var t = new BN(3);
  assertEquals(
    new BN("12345678901234567890123456", 16).idivn(3).toString(16),
    new BN("12345678901234567890123456", 16).div(t).toString(16),
    "should divide numbers in-place",
  );
});

Deno.test(".divRound()", () => {
  assertEquals(
    new BN(9).divRound(new BN(20)).toString(10),
    "0",
    "should divide numbers with rounding",
  );
  assertEquals(
    new BN(10).divRound(new BN(20)).toString(10),
    "1",
    "should divide numbers with rounding",
  );
  assertEquals(
    new BN(150).divRound(new BN(20)).toString(10),
    "8",
    "should divide numbers with rounding",
  );
  assertEquals(
    new BN(149).divRound(new BN(20)).toString(10),
    "7",
    "should divide numbers with rounding",
  );
  assertEquals(
    new BN(149).divRound(new BN(17)).toString(10),
    "9",
    "should divide numbers with rounding",
  );
  assertEquals(
    new BN(144).divRound(new BN(17)).toString(10),
    "8",
    "should divide numbers with rounding",
  );
  assertEquals(
    new BN(-144).divRound(new BN(17)).toString(10),
    "-8",
    "should divide numbers with rounding",
  );

  assertEquals(
    new BN(144).divRound(new BN(144)).toString(10),
    "1",
    "should return 1 on exact division",
  );
});

Deno.test(".mod()", () => {
  assertEquals(
    new BN("256").mod(new BN(10)).toString(10),
    "6",
    "should modulo small numbers (<=26 bits)",
  );
  assertEquals(
    new BN("-256").mod(new BN(10)).toString(10),
    "-6",
    "should modulo small numbers (<=26 bits)",
  );
  assertEquals(
    new BN("256").mod(new BN(-10)).toString(10),
    "6",
    "should modulo small numbers (<=26 bits)",
  );
  assertEquals(
    new BN("-256").mod(new BN(-10)).toString(10),
    "-6",
    "should modulo small numbers (<=26 bits)",
  );

  assertEquals(
    new BN("10").mod(new BN(256)).toString(10),
    "10",
    "should modulo small numbers (<=26 bits)",
  );
  assertEquals(
    new BN("-10").mod(new BN(256)).toString(10),
    "-10",
    "should modulo small numbers (<=26 bits)",
  );
  assertEquals(
    new BN("10").mod(new BN(-256)).toString(10),
    "10",
    "should modulo small numbers (<=26 bits)",
  );
  assertEquals(
    new BN("-10").mod(new BN(-256)).toString(10),
    "-10",
    "should modulo small numbers (<=26 bits)",
  );

  assertEquals(
    new BN("1222222225255589").mod(new BN("611111124969028"))
      .toString(10),
    "611111100286561",
    "should modulo large numbers (>53 bits)",
  );
  assertEquals(
    new BN("-1222222225255589").mod(new BN("611111124969028"))
      .toString(10),
    "-611111100286561",
    "should modulo large numbers (>53 bits)",
  );
  assertEquals(
    new BN("1222222225255589").mod(new BN("-611111124969028"))
      .toString(10),
    "611111100286561",
    "should modulo large numbers (>53 bits)",
  );
  assertEquals(
    new BN("-1222222225255589").mod(new BN("-611111124969028"))
      .toString(10),
    "-611111100286561",
    "should modulo large numbers (>53 bits)",
  );

  assertEquals(
    new BN("611111124969028").mod(new BN("1222222225255589"))
      .toString(10),
    "611111124969028",
    "should modulo large numbers (>53 bits)",
  );
  assertEquals(
    new BN("-611111124969028").mod(new BN("1222222225255589"))
      .toString(10),
    "-611111124969028",
    "should modulo large numbers (>53 bits)",
  );
  assertEquals(
    new BN("611111124969028").mod(new BN("-1222222225255589"))
      .toString(10),
    "611111124969028",
    "should modulo large numbers (>53 bits)",
  );
  assertEquals(
    new BN("-611111124969028").mod(new BN("-1222222225255589"))
      .toString(10),
    "-611111124969028",
    "should modulo large numbers (>53 bits)",
  );

  assertEquals(
    new BN("10").mod(new BN(256)).toString(16),
    "a",
    "should mod numbers",
  );
  assertEquals(
    new BN("69527932928").mod(new BN("16974594")).toString(16),
    "102f302",
    "should mod numbers",
  );

  // 178 = 10 * 17 + 8
  assertEquals(
    new BN(178).div(new BN(10)).toNumber(),
    17,
    "should mod numbers",
  );
  assertEquals(new BN(178).mod(new BN(10)).toNumber(), 8, "should mod numbers");
  assertEquals(
    new BN(178).umod(new BN(10)).toNumber(),
    8,
    "should mod numbers",
  );

  // -178 = 10 * (-17) + (-8)
  assertEquals(
    new BN(-178).div(new BN(10)).toNumber(),
    -17,
    "should mod numbers",
  );
  assertEquals(
    new BN(-178).mod(new BN(10)).toNumber(),
    -8,
    "should mod numbers",
  );
  assertEquals(
    new BN(-178).umod(new BN(10)).toNumber(),
    2,
    "should mod numbers",
  );

  // 178 = -10 * (-17) + 8
  assertEquals(
    new BN(178).div(new BN(-10)).toNumber(),
    -17,
    "should mod numbers",
  );
  assertEquals(
    new BN(178).mod(new BN(-10)).toNumber(),
    8,
    "should mod numbers",
  );
  assertEquals(
    new BN(178).umod(new BN(-10)).toNumber(),
    8,
    "should mod numbers",
  );

  // -178 = -10 * (17) + (-8)
  assertEquals(
    new BN(-178).div(new BN(-10)).toNumber(),
    17,
    "should mod numbers",
  );
  assertEquals(
    new BN(-178).mod(new BN(-10)).toNumber(),
    -8,
    "should mod numbers",
  );
  assertEquals(
    new BN(-178).umod(new BN(-10)).toNumber(),
    2,
    "should mod numbers",
  );

  // -4 = 1 * (-3) + -1
  assertEquals(new BN(-4).div(new BN(-3)).toNumber(), 1, "should mod numbers");
  assertEquals(new BN(-4).mod(new BN(-3)).toNumber(), -1, "should mod numbers");

  // -4 = -1 * (3) + -1
  assertEquals(new BN(-4).mod(new BN(3)).toNumber(), -1, "should mod numbers");
  // -4 = 1 * (-3) + (-1 + 3)
  assertEquals(new BN(-4).umod(new BN(-3)).toNumber(), 2, "should mod numbers");

  var p = new BN(
    "ffffffff00000001000000000000000000000000ffffffffffffffffffffffff",
    16,
  );
  var a = new BN(
    "fffffffe00000003fffffffd0000000200000001fffffffe00000002ffffffff" +
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    16,
  );
  assertEquals(
    a.mod(p).toString(16),
    "0",
    "should mod numbers",
  );

  a = new BN("945304eb96065b2a98b57a48a06ae28d285a71b5", "hex");
  var b = new BN(
    "fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe",
    "hex",
  );

  assertEquals(
    a.mul(b).mod(a).cmpn(0),
    0,
    "should properly carry the sign inside division",
  );
});

Deno.test(".modrn()", () => {
  assertEquals(
    new BN("10", 16).modrn(256).toString(16),
    "10",
    "should act like .mod() on small numbers",
  );
  assertEquals(
    new BN("10", 16).modrn(-256).toString(16),
    "-10",
    "should act like .mod() on small numbers",
  );
  assertEquals(
    new BN("100", 16).modrn(256).toString(16),
    "0",
    "should act like .mod() on small numbers",
  );
  assertEquals(
    new BN("1001", 16).modrn(256).toString(16),
    "1",
    "should act like .mod() on small numbers",
  );
  assertEquals(
    new BN("100000000001", 16).modrn(256).toString(16),
    "1",
    "should act like .mod() on small numbers",
  );
  assertEquals(
    new BN("100000000001", 16).modrn(257).toString(16),
    new BN("100000000001", 16).mod(new BN(257)).toString(16),
    "should act like .mod() on small numbers",
  );
  assertEquals(
    new BN("123456789012", 16).modrn(3).toString(16),
    new BN("123456789012", 16).mod(new BN(3)).toString(16),
    "should act like .mod() on small numbers",
  );
});

Deno.test(".abs()", () => {
  assertEquals(
    new BN(0x1001).abs().toString(),
    "4097",
    "should return absolute value",
  );
  assertEquals(
    new BN(-0x1001).abs().toString(),
    "4097",
    "should return absolute value",
  );
  assertEquals(
    new BN("ffffffff", 16).abs().toString(),
    "4294967295",
    "should return absolute value",
  );
});

Deno.test(".invm()", () => {
  var p = new BN(257);
  var a = new BN(3);
  var b = a.invm(p);
  assertEquals(
    a.mul(b).mod(p).toString(16),
    "1",
    "should invert relatively-prime numbers",
  );

  var p192 = new BN(
    "fffffffffffffffffffffffffffffffeffffffffffffffff",
    16,
  );
  a = new BN("deadbeef", 16);
  b = a.invm(p192);
  assertEquals(
    a.mul(b).mod(p192).toString(16),
    "1",
    "should invert relatively-prime numbers",
  );

  // Even base
  var phi = new BN("872d9b030ba368706b68932cf07a0e0c", 16);
  var e = new BN(65537);
  var d = e.invm(phi);
  assertEquals(
    e.mul(d).mod(phi).toString(16),
    "1",
    "should invert relatively-prime numbers",
  );

  // Even base (take #2)
  a = new BN("5");
  b = new BN("6");
  var r = a.invm(b);
  assertEquals(
    r.mul(a).mod(b).toString(16),
    "1",
    "should invert relatively-prime numbers",
  );
});

Deno.test(".gcd()", () => {
  assertEquals(new BN(3).gcd(new BN(2)).toString(10), "1", "should return GCD");
  assertEquals(
    new BN(18).gcd(new BN(12)).toString(10),
    "6",
    "should return GCD",
  );
  assertEquals(
    new BN(-18).gcd(new BN(12)).toString(10),
    "6",
    "should return GCD",
  );
  assertEquals(
    new BN(-18).gcd(new BN(-12)).toString(10),
    "6",
    "should return GCD",
  );
  assertEquals(
    new BN(-18).gcd(new BN(0)).toString(10),
    "18",
    "should return GCD",
  );
  assertEquals(
    new BN(0).gcd(new BN(-18)).toString(10),
    "18",
    "should return GCD",
  );
  assertEquals(new BN(2).gcd(new BN(0)).toString(10), "2", "should return GCD");
  assertEquals(new BN(0).gcd(new BN(3)).toString(10), "3", "should return GCD");
  assertEquals(new BN(0).gcd(new BN(0)).toString(10), "0", "should return GCD");
});

Deno.test(".egcd()", () => {
  assertEquals(
    new BN(3).egcd(new BN(2)).gcd.toString(10),
    "1",
    "should return EGCD",
  );
  assertEquals(
    new BN(18).egcd(new BN(12)).gcd.toString(10),
    "6",
    "should return EGCD",
  );
  assertEquals(
    new BN(-18).egcd(new BN(12)).gcd.toString(10),
    "6",
    "should return EGCD",
  );
  assertEquals(
    new BN(0).egcd(new BN(12)).gcd.toString(10),
    "12",
    "should return EGCD",
  );

  assertThrows(
    function () {
      new BN(1).egcd(0);
    },
    Error,
    "Assertion failed",
    "should not allow 0 input",
  );

  assertThrows(
    function () {
      new BN(1).egcd(-1);
    },
    Error,
    "Assertion failed",
    "should not allow negative input",
  );
});

Deno.test("BN.max(a, b)", () => {
  assertEquals(
    BN.max(new BN(3), new BN(2)).toString(16),
    "3",
    "should return maximum",
  );
  assertEquals(
    BN.max(new BN(2), new BN(3)).toString(16),
    "3",
    "should return maximum",
  );
  assertEquals(
    BN.max(new BN(2), new BN(2)).toString(16),
    "2",
    "should return maximum",
  );
  assertEquals(
    BN.max(new BN(2), new BN(-2)).toString(16),
    "2",
    "should return maximum",
  );
});

Deno.test("BN.min(a, b)", () => {
  assertEquals(
    BN.min(new BN(3), new BN(2)).toString(16),
    "2",
    "should return minimum",
  );
  assertEquals(
    BN.min(new BN(2), new BN(3)).toString(16),
    "2",
    "should return minimum",
  );
  assertEquals(
    BN.min(new BN(2), new BN(2)).toString(16),
    "2",
    "should return minimum",
  );
  assertEquals(
    BN.min(new BN(2), new BN(-2)).toString(16),
    "-2",
    "should return minimum",
  );
});

Deno.test("BN.ineg()", () => {
  assertEquals(
    new BN(0).ineg().toString(10),
    "0",
    "shouldn't change sign for zero",
  );
});
