import { Buffer } from "https://deno.land/std@0.100.0/node/buffer.ts";
import { assertEquals } from "https://deno.land/std@0.99.0/testing/asserts.ts";
import { BN } from "../../lib/bn.js";
import { dhGroups } from "../fixtures.js";

Deno.test("BN.js/Slow DH test", () => {
  var groups = dhGroups;
  Object.keys(groups).forEach(function (name) {
    var group = groups[name];

    var base = new BN(2);
    var mont = BN.red(new BN(group.prime, 16));
    var priv = new BN(group.priv, 16);
    var multed = base.toRed(mont).redPow(priv).fromRed();
    var actual = Buffer.from(multed.toArray());
    assertEquals(
      actual.toString("hex"),
      group.pub,
      `should match public key for ${name} group`,
    );
  });
});
