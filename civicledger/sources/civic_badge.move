address 0xd6516e5440520ebea764c6ea3d085ff7d7a276244c0caf5d68ff9b10034a041e {
    module civic_badge {
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
                name: string::utf8(b"CivicLedger Certified"),
            });
        }

        public fun get_badge(addr: address): string::String acquires Badge {
            assert!(has_badge(addr), 101);
            borrow_global<Badge>(addr).name
        }
    }
}
