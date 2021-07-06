// NOTE: This could be potentionally used to generate loop-less multiplications
function genCombMulTo(alen, blen) {
  var len = alen + blen - 1;
  var src = [
    "var a = self.words;",
    "var b = num.words;",
    "var o = out.words;",
    "var c = 0;",
    "var lo;",
    "var mid;",
    "var hi;",
  ];
  for (let i = 0; i < alen; i++) {
    src.push("var a" + i + " = a[" + i + "] | 0;");
    src.push("var al" + i + " = a" + i + " & 0x1fff;");
    src.push("var ah" + i + " = a" + i + " >>> 13;");
  }
  for (let i = 0; i < blen; i++) {
    src.push("var b" + i + " = b[" + i + "] | 0;");
    src.push("var bl" + i + " = b" + i + " & 0x1fff;");
    src.push("var bh" + i + " = b" + i + " >>> 13;");
  }
  src.push("");
  src.push("out.negative = self.negative ^ num.negative;");
  src.push("out.length = " + len + ";");

  for (let k = 0; k < len; k++) {
    const minJ = Math.max(0, k - alen + 1);
    const maxJ = Math.min(k, blen - 1);

    src.push("/* k = " + k + " */");
    src.push("var w" + k + " = c;");
    src.push("c = 0;");
    for (let j = minJ; j <= maxJ; j++) {
      const i = k - j;

      src.push("lo = Math.imul(al" + i + ", bl" + j + ");");
      src.push("mid = Math.imul(al" + i + ", bh" + j + ");");
      src.push("mid = (mid + Math.imul(ah" + i + ", bl" + j + ")) | 0;");
      src.push("hi = Math.imul(ah" + i + ", bh" + j + ");");

      src.push("w" + k + " = (w" + k + " + lo) | 0;");
      src.push("w" + k + " = (w" + k + " + ((mid & 0x1fff) << 13)) | 0;");
      src.push("c = (c + hi) | 0;");
      src.push("c = (c + (mid >>> 13)) | 0;");
      src.push("c = (c + (w" + k + " >>> 26)) | 0;");
      src.push("w" + k + " &= 0x3ffffff;");
    }
  }

  let k = 0;
  // Store in separate step for better memory access
  for (k = 0; k < len; k++) {
    src.push("o[" + k + "] = w" + k + ";");
  }
  src.push("if (c !== 0) {");
  src.push("  o[" + k + "] = c;");
  src.push("  out.length++;");
  src.push("}");
  src.push("return out;");

  return src.join("\n");
}

console.log(genCombMulTo(10, 10));
