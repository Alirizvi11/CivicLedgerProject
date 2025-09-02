module civicledger::voting {
    use std::signer;
    use std::string;
    use std::vector;

    /// Proposal structure
    struct Proposal has store {
        title: string::String,
        yes: u64,
        no: u64,
        active: bool
    }

    /// Storage for proposals
    struct ProposalStore has key {
        proposals: vector<Proposal>
    }

    /// Create a new proposal
    public entry fun create(account: &signer, title: string::String) acquires ProposalStore {
        let addr = signer::address_of(account);
        if (!exists<ProposalStore>(addr)) {
            move_to(account, ProposalStore { proposals: vector::empty<Proposal>() });
        };

        let store = borrow_global_mut<ProposalStore>(addr);
        let proposal = Proposal {
            title,
            yes: 0,
            no: 0,
            active: true
        };
        vector::push_back(&mut store.proposals, proposal);
    }

    /// Cast a vote on a proposal
    public entry fun vote(account: &signer, owner: address, id: u64, support: bool) acquires ProposalStore {
        let store = borrow_global_mut<ProposalStore>(owner);
        let proposal = vector::borrow_mut(&mut store.proposals, id);
        assert!(proposal.active, 2);

        if (support) {
            proposal.yes = proposal.yes + 1;
        } else {
            proposal.no = proposal.no + 1;
        };
    }

    /// ✅ View: Get number of proposals for an address
    #[view]
    public fun proposals_len(owner: address): u64 acquires ProposalStore {
        if (!exists<ProposalStore>(owner)) {
            return 0;
        };
        let store = borrow_global<ProposalStore>(owner);
        vector::length(&store.proposals)
    }

    /// ✅ View: Get a specific proposal by index
    #[view]
    public fun borrow_proposal(owner: address, id: u64): (vector<u8>, u64, u64, bool) acquires ProposalStore {
        let store = borrow_global<ProposalStore>(owner);
        let proposal = vector::borrow(&store.proposals, id);

        // Convert title (string::String) into bytes
        let title_bytes_ref = string::bytes(&proposal.title);
        let title_bytes = vector::empty<u8>();
        let len = vector::length(title_bytes_ref);
        let i = 0;
        while (i < len) {
            let b = *vector::borrow(title_bytes_ref, i);
            vector::push_back(&mut title_bytes, b);
            i = i + 1;
        };

        (title_bytes, proposal.yes, proposal.no, proposal.active)
    }
}
