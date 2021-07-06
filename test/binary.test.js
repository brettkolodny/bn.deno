import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { BN } from "../lib/bn.js";

Deno.test(".shln()", () => {
  assertEquals(
    new BN("69527932928").shln(13).toString(16),
    "2060602000000",
    "should shl numbers",
  );
  assertEquals(
    new BN("69527932928").shln(45).toString(16),
    "206060200000000000000",
    "should shl numbers",
  );
});

Deno.test(".ushln()", () => {
  assertEquals(
    new BN("69527932928").ushln(13).toString(16),
    "2060602000000",
    "should ushl numbers",
  );
  assertEquals(
    new BN("69527932928").ushln(45).toString(16),
    "206060200000000000000",
    "should ushl numbers",
  );
});

Deno.test(".shrn()", () => {
  assertEquals(
    new BN("69527932928").shrn(13).toString(16),
    "818180",
    "should shr numbers",
  );
  assertEquals(
    new BN("69527932928").shrn(17).toString(16),
    "81818",
    "should shr numbers",
  );
  assertEquals(
    new BN("69527932928").shrn(256).toString(16),
    "0",
    "should shr numbers",
  );
});

Deno.test(".ushrn()", () => {
  assertEquals(
    new BN("69527932928").ushrn(13).toString(16),
    "818180",
    "should ushr numbers",
  );
  assertEquals(
    new BN("69527932928").ushrn(17).toString(16),
    "81818",
    "should ushr numbers",
  );
  assertEquals(
    new BN("69527932928").ushrn(256).toString(16),
    "0",
    "should ushr numbers",
  );
});

Deno.test(".bincn()", () => {
  assertEquals(new BN(0).bincn(1).toString(16), "2", "should increment bit");
  assertEquals(new BN(2).bincn(1).toString(16), "4", "should increment bit");
  assertEquals(
    new BN(2).bincn(1).bincn(1).toString(16),
    new BN(2).bincn(2).toString(16),
    "should increment bit",
  );
  assertEquals(
    new BN(0xffffff).bincn(1).toString(16),
    "1000001",
    "should increment bit",
  );
  assertEquals(
    new BN(2).bincn(63).toString(16),
    "8000000000000002",
    "should increment bit",
  );
});

Deno.test(".imaskn()", () => {
  assertEquals(
    new BN(0).imaskn(1).toString(16),
    "0",
    "should mask bits in-place",
  );
  assertEquals(
    new BN(3).imaskn(1).toString(16),
    "1",
    "should mask bits in-place",
  );
  assertEquals(
    new BN("123456789", 16).imaskn(4).toString(16),
    "9",
    "should mask bits in-place",
  );
  assertEquals(
    new BN("123456789", 16).imaskn(16).toString(16),
    "6789",
    "should mask bits in-place",
  );
  assertEquals(
    new BN("123456789", 16).imaskn(28).toString(16),
    "3456789",
    "should mask bits in-place",
  );

  assertEquals(
    new BN(0xe3).imaskn(56).toString(16),
    "e3",
    "should not mask when number is bigger than length",
  );
  assertEquals(
    new BN(0xe3).imaskn(26).toString(16),
    "e3",
    "should not mask when number is bigger than length",
  );
});

Deno.test(".testn()", () => {
  [
    "ff",
    "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  ].forEach(function (hex) {
    const bn = new BN(hex, 16);
    const bl = bn.bitLength();

    for (let i = 0; i < bl; ++i) {
      assertEquals(bn.testn(i), true, "should support test specific bit");
    }

    // test off the end
    assertEquals(bn.testn(bl), false, "should support test specific bit");
  });

  const xbits = "01111001010111001001000100011101" +
    "11010011101100011000111001011101" +
    "10010100111000000001011000111101" +
    "01011111001111100100011110000010" +
    "01011010100111010001010011000100" +
    "01101001011110100001001111100110" +
    "001110010111";

  let x = new BN(
    "23478905234580795234378912401239784125643978256123048348957342",
  );
  for (let i = 0; i < x.bitLength(); ++i) {
    assertEquals(x.testn(i), xbits.charAt(i) === "1", "Failed @ bit " + i);
  }

  x = new BN("abcd", 16);
  assert(!x.testn(128), "should have short-cuts");
});

Deno.test(".and()", () => {
  assertEquals(
    new BN("1010101010101010101010101010101010101010", 2)
      .and(new BN("101010101010101010101010101010101010101", 2))
      .toString(2),
    "0",
    "should and numbers",
  );

  assertEquals(
    new BN("abcd0000ffff", 16).and(new BN("abcd", 16)).toString(16),
    "abcd",
    "should and numbers of different limb-length",
  );
});

Deno.test(".iand()", () => {
  assertEquals(
    new BN("1010101010101010101010101010101010101010", 2)
      .iand(new BN("101010101010101010101010101010101010101", 2))
      .toString(2),
    "0",
    "should iand numbers",
  );

  assertEquals(
    new BN("1000000000000000000000000000000000000001", 2)
      .iand(new BN("1", 2))
      .toString(2),
    "1",
    "should iand numbers",
  );

  assertEquals(
    new BN("1", 2)
      .iand(new BN("1000000000000000000000000000000000000001", 2))
      .toString(2),
    "1",
    "should iand numbers",
  );
});

Deno.test(".or()", () => {
  assertEquals(
    new BN("1010101010101010101010101010101010101010", 2)
      .or(new BN("101010101010101010101010101010101010101", 2))
      .toString(2),
    "1111111111111111111111111111111111111111",
    "should or numbers",
  );

  assertEquals(
    new BN("abcd00000000", 16).or(new BN("abcd", 16)).toString(16),
    "abcd0000abcd",
    "should or numbers of different limb-length",
  );
});

Deno.test(".ior()", () => {
  assertEquals(
    new BN("1010101010101010101010101010101010101010", 2)
      .ior(new BN("101010101010101010101010101010101010101", 2))
      .toString(2),
    "1111111111111111111111111111111111111111",
    "should ior numbers",
  );
  assertEquals(
    new BN("1000000000000000000000000000000000000000", 2)
      .ior(new BN("1", 2))
      .toString(2),
    "1000000000000000000000000000000000000001",
    "should ior numbers",
  );
  assertEquals(
    new BN("1", 2)
      .ior(new BN("1000000000000000000000000000000000000000", 2))
      .toString(2),
    "1000000000000000000000000000000000000001",
    "should ior numbers",
  );
});

Deno.test(".xor()", () => {
  assertEquals(
    new BN("11001100110011001100110011001100", 2)
      .xor(new BN("1100110011001100110011001100110", 2))
      .toString(2),
    "10101010101010101010101010101010",
    "should xor numbers",
  );

  assertEquals(
    new BN("abcd0000ffff", 16).xor(new BN("abcd", 16)).toString(16),
    "abcd00005432",
    "should and numbers of different limb-length",
  );
});

Deno.test(".ixor()", () => {
  assertEquals(
    new BN("11001100110011001100110011001100", 2)
      .ixor(new BN("1100110011001100110011001100110", 2))
      .toString(2),
    "10101010101010101010101010101010",
    "should ixor numbers",
  );
  assertEquals(
    new BN("11001100110011001100110011001100", 2)
      .ixor(new BN("1", 2))
      .toString(2),
    "11001100110011001100110011001101",
    "should ixor numbers",
  );
  assertEquals(
    new BN("1", 2)
      .ixor(new BN("11001100110011001100110011001100", 2))
      .toString(2),
    "11001100110011001100110011001101",
    "should ixor numbers",
  );
});

Deno.test(".setn()", () => {
  assertEquals(new BN(0).setn(2, true).toString(2), "100");
  assertEquals(
    new BN(0).setn(27, true).toString(2),
    "1000000000000000000000000000",
    "should allow single bits to be set",
  );
  assertEquals(
    new BN(0).setn(63, true).toString(16),
    new BN(1).iushln(63).toString(16),
    "should allow single bits to be set",
  );
  assertEquals(
    new BN("1000000000000000000000000001", 2).setn(27, false).toString(2),
    "1",
    "should allow single bits to be set",
  );
  assertEquals(
    new BN("101", 2).setn(2, false).toString(2),
    "1",
    "should allow single bits to be set",
  );
});

Deno.test(".notn()", () => {
  assertEquals(
    new BN("111000111", 2).notn(9).toString(2),
    "111000",
    "should allow bitwise negation",
  );
  assertEquals(
    new BN("000111000", 2).notn(9).toString(2),
    "111000111",
    "should allow bitwise negation",
  );
  assertEquals(
    new BN("111000111", 2).notn(9).toString(2),
    "111000",
    "should allow bitwise negation",
  );
  assertEquals(
    new BN("000111000", 2).notn(9).toString(2),
    "111000111",
    "should allow bitwise negation",
  );
  assertEquals(
    new BN("111000111", 2).notn(32).toString(2),
    "11111111111111111111111000111000",
    "should allow bitwise negation",
  );
  assertEquals(
    new BN("000111000", 2).notn(32).toString(2),
    "11111111111111111111111111000111",
    "should allow bitwise negation",
  );
  assertEquals(
    new BN("111000111", 2).notn(68).toString(2),
    "11111111111111111111111111111111" + "111111111111111111111111111000111000",
    "should allow bitwise negation",
  );
  assertEquals(
    new BN("000111000", 2).notn(68).toString(2),
    "11111111111111111111111111111111" + "111111111111111111111111111111000111",
    "should allow bitwise negation",
  );
});
