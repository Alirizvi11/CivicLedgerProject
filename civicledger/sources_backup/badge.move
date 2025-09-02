address 0xd8a5db309addc49542f3d35182e013c5582162a9f23ed312395d7be0b2e1ca0f {
    module badge {
        use std::signer;
        use std::string;

        struct Badge has key {
            name: string::String,
        }

        public fun has_badge(addr: address): bool {
            exists<Badge>(addr)
        }

        public entry fun claim_badge(account: &signer) {
            let addr = signer::address_of(account);
            assert!(!has_badge(addr), 100);
            move_to(account, Badge {
                name: string::utf8(b"SkillLink Certified"),
            });
        }

        public fun get_badge(addr: address): string::String acquires Badge {
            assert!(has_badge(addr), 101);
            borrow_global<Badge>(addr).name
        }
    }
}
