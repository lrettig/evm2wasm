;; XOR(sp[-1], sp[-2])
(func $XOR
  (param $sp i32)
  (result i32)

  (i64.store (i32.sub (get_local $sp) (i32.const 32)) (i64.xor (i64.load (i32.sub (get_local $sp) (i32.const 32))) (i64.load (i32.sub (get_local $sp) (i32.const 0)))))
  (i64.store (i32.sub (get_local $sp) (i32.const 40)) (i64.xor (i64.load (i32.sub (get_local $sp) (i32.const 40))) (i64.load (i32.sub (get_local $sp) (i32.const 8)))))
  (i64.store (i32.sub (get_local $sp) (i32.const 48)) (i64.xor (i64.load (i32.sub (get_local $sp) (i32.const 48))) (i64.load (i32.sub (get_local $sp) (i32.const 16)))))
  (i64.store (i32.sub (get_local $sp) (i32.const 56)) (i64.xor (i64.load (i32.sub (get_local $sp) (i32.const 56))) (i64.load (i32.sub (get_local $sp) (i32.const 24)))))

  (set_local $sp (i32.sub (get_local $sp) (i32.const 32)))

  (return (get_local $sp))
)
