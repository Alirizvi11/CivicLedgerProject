address 0xd6516e5440520ebea764c6ea3d085ff7d7a276244c0caf5d68ff9b10034a041e {
    module proposal_store {
        use std::signer;
        use std::vector;
        use std::timestamp;
        use std::option;

        struct Expense has copy, drop, store {
            label: vector<u8>,
            amount: u64,
            timestamp: u64,
        }

        struct Proposal has copy, drop, store {
            id: u64,
            title: vector<u8>,
            description: vector<u8>,
            proposer: address,
            budget: u64,
            spent: u64,
            expenses: vector<Expense>,
            approved: bool,
            timestamp: u64,
        }

        struct Store has key {
            proposals: vector<Proposal>,
            next_id: u64,
        }

        public entry fun init(account: &signer) {
            move_to(account, Store {
                proposals: vector::empty<Proposal>(),
                next_id: 1,
            });
        }

        public entry fun submit(
            account: &signer,
            title: vector<u8>,
            description: vector<u8>,
            budget: u64
        ) acquires Store {
            let store = borrow_global_mut<Store>(signer::address_of(account));
            let proposal = Proposal {
                id: store.next_id,
                title,
                description,
                proposer: signer::address_of(account),
                budget,
                spent: 0,
                expenses: vector::empty<Expense>(),
                approved: false,
                timestamp: timestamp::now_seconds(),
            };
            store.next_id = store.next_id + 1;
            vector::push_back(&mut store.proposals, proposal);
        }

        public entry fun approve(account: &signer, proposal_id: u64) acquires Store {
            let store = borrow_global_mut<Store>(signer::address_of(account));
            let i_opt = find_index(&store.proposals, proposal_id);
            assert!(option::is_some(&i_opt), 404);
            let i = option::extract(&mut i_opt);
            let p = vector::borrow_mut(&mut store.proposals, i);
            p.approved = true;
        }

        public entry fun log_expense(
            account: &signer,
            proposal_id: u64,
            label: vector<u8>,
            amount: u64
        ) acquires Store {
            let store = borrow_global_mut<Store>(signer::address_of(account));
            let i_opt = find_index(&store.proposals, proposal_id);
            assert!(option::is_some(&i_opt), 404);
            let i = option::extract(&mut i_opt);
            let p = vector::borrow_mut(&mut store.proposals, i);

            assert!(p.approved, 100);
            assert!(p.proposer == signer::address_of(account), 101);
            assert!(p.spent + amount <= p.budget, 102);

            let e = Expense {
                label,
                amount,
                timestamp: timestamp::now_seconds(),
            };
            vector::push_back(&mut p.expenses, e);
            p.spent = p.spent + amount;
        }

        public fun get_remaining(account: address, proposal_id: u64): u64 acquires Store {
            let store = borrow_global<Store>(account);
            let i_opt = find_index(&store.proposals, proposal_id);
            assert!(option::is_some(&i_opt), 404);
            let i = option::extract(&mut i_opt);
            let p = vector::borrow(&store.proposals, i);
            p.budget - p.spent
        }

       public fun get_all(account: address): vector<Proposal> acquires Store {
          let store = borrow_global<Store>(account);
          let original = &store.proposals;
          let result = vector::empty<Proposal>(); // 👈 copy -> result
          let i = 0;
          let len = vector::length(original);
          while (i < len) {
             let item = vector::borrow(original, i);
             vector::push_back(&mut result, *item);
             i = i + 1;
        };
        result
    }


        fun find_index(proposals: &vector<Proposal>, id: u64): option::Option<u64> {
            let len = vector::length(proposals);
            let i = 0;
            while (i < len) {
                let p = vector::borrow(proposals, i);
                if (p.id == id) {
                    return option::some(i);
                };
                i = i + 1;
            };
            option::none()
        }
    }
}
