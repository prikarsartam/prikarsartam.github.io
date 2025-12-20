---
id: fundamental_principles_of_physics
title: Fundamental principles of physics
level: "2"
color:
parent: logic_of_nature
connections:
last_updated: 2025-10-22
---

## I. Foundational Particles and Interactions

**Elementary Particle Structure:** The universe's constituents are classified within the Standard Model as fermions (spin-$1/2$ matter particles) and bosons (spin-$1$ mediators). The theory describes three fundamental interactions: electromagnetism (mediated by photons), the weak force (W and Z bosons), and the strong force (gluons). Elementary particles are not point-like but rather **excitations of quantum fields permeating all spacetime**, where the field ontology provides the natural framework for understanding particle creation and annihilation at fundamental scales.

**Mathematical Structure:** The Standard Model Lagrangian is built on gauge invariance with group $SU(3)_c \times SU(2)_L \times U(1)_Y$, where each gauge symmetry ensures local invariance under transformation groups. The requirement of local gauge symmetry—beginning with the simplest case of electromagnetic theory with $U(1)$ invariance—generates the interaction structure between particles.
## II. Symmetry Principles and Noether's Theorem

**Conservation Laws from Symmetry:** Noether's theorem establishes that every continuous symmetry of the action corresponds to a conserved quantity. This fundamental principle links:

- **Spatial translation invariance** → momentum conservation
    
- **Temporal translation invariance** → energy conservation
    
- **Rotational invariance** → angular momentum conservation
    

Mathematically, for a Lagrangian $\mathcal{L}(q, \dot{q})$ invariant under continuous transformations $q \rightarrow q + \varepsilon \eta(q)$, [Noether's first theorem yields the conserved current](https://mecheng.iisc.ac.in/suresh/me256/Lectures/Noether_theorem.pdf)​

$$j_μ=  \frac{\partial \mathcal{L}}{\partial(\partial_\mu \phi)} \frac{\delta \phi}{\delta \omega} - \mathcal{L} \frac{\delta x^\mu}{\delta \omega}jμ$$

where conservation means $\partial_\mu j^\mu = 0$ along classical trajectories.

**Gauge Symmetries:** Local gauge invariance imposes strict constraints on theory structure. In quantum field theory, [covariant derivatives replace ordinary derivatives to maintain gauge invariance]: $\partial_\mu \rightarrow D_\mu = \partial_\mu - igA_\mu^a T^a$, where $A_\mu^a$ are [gauge fields transforming as representations of the symmetry group.](http://scipp.ucsc.edu/~haber/ph218/Gauge_Theories_and_the_Standard_Model.pdf)​

## III. Spontaneous Symmetry Breaking

**Mechanism and Consequences:** Although the Lagrangian respects a continuous symmetry, the vacuum expectation value (VEV) of the field may not. For a scalar field potential with degenerate minima, the system selects one ground state, breaking the original symmetry. The key distinction: [the equations of motion remain symmetric, but the solution is not](https://philsci-archive.pitt.edu/9295/1/Spontaneous_symmetry_breaking_in_the_Higgs_mechanism.pdf)​

[Goldstone's theorem proves that spontaneously broken continuous global symmetries produce massless scalar excitations (Nambu-Goldstone bosons)](https://www.damtp.cam.ac.uk/user/tong/sft.html) . The dispersion relation for these excitations vanishes at zero momentum, indicating zero mass.

**Higgs Mechanism:** When a local (gauge) symmetry is spontaneously broken, gauge bosons become massive by "eating" the Goldstone bosons, acquiring a third polarization state. The mechanism transforms:youtube​

- Massless gauge fields with 2 transverse polarizations
    
- Massless scalar (Goldstone mode)  
    → **Massive gauge bosons with 3 polarizations**
    

This process is central to electroweak symmetry breaking, where $SU(2) \times U(1)$ breaks to $U(1)_{\text{EM}}$, generating masses for W and Z bosons.​

## IV. Quantum Field Theory and Correlation Functions

**Path Integral Formulation:** Feynman's path integral assigns equal weight to all trajectories but with varying phase. The quantum amplitude becomes:​

$$⟨qf,tf∣qi,ti⟩=∫D[q(t)] \exp⁡(iS[q]ℏ)\langle q_f, t_f | q_i, t_i \rangle $$
$$= \int \mathcal{D}[q(t)] \exp\left(\frac{iS[q]}{\hbar}\right)⟨qf,tf∣qi,ti⟩=∫D[q(t)] \exp(ℏiS[q])$$

where $S[q] = \int \mathcal{L}(q,\dot{q})dt$ is the classical action. In the limit $\hbar \to 0$, quantum interference suppresses non-classical paths, recovering classical mechanics—demonstrating that quantum mechanics is the fundamental framework from which classical behavior emerges.​

**Correlation Functions and Propagators:** Two-point correlation functions encode the fundamental information about field dynamics. In quantum field theory:

$$G(x−y)=⟨0∣T[ϕ(x)ϕ(y)]∣0⟩G(x-y) = \langle 0 | \mathcal{T}[\phi(x)\phi(y)] | 0 \rangle G(x−y)=⟨0∣T[ϕ(x)ϕ(y)]∣0⟩
$$
where $\mathcal{T}$ denotes time ordering. The Feynman propagator $\Delta_F(x-y)$ represents the amplitude for a particle to travel from $y$ to $x$, satisfying the Euler-Lagrange equations​

$$(∂^2+m^2)\Delta F(x−y)=−δ^4(x−y)(\partial^2 + m^2)\Delta F(x-y) = -\delta^4(x-y)(∂^2+m^2) \Delta  F(x−y)=−\delta^4(x−y)$$

**Wick's Theorem and Feynman Diagrams:** Wick's theorem reduces arbitrary products of creation/annihilation operators to sums of normal-ordered products and contractions. A contraction between two fields yields the propagator:

$$ϕ(x1)ϕ(x2)‾= \Delta F(x1−x2) \overline{\phi(x_1)\phi(x_2)} = \Delta_F(x_1 - x_2)ϕ(x1)ϕ(x2)=\Delta F(x1−x2)$$

This allows systematic construction of Feynman diagrams where each line is a propagator, each vertex represents an interaction, and loop integrals correspond to quantum corrections.

## V. Asymptotic Freedom and Running Couplings

**Beta Functions and Scale Dependence:** In quantum field theory, coupling constants depend on the energy scale—they "run"'. For QCD, the [running coupling strength](https://arxiv.org/pdf/1604.08082.pdf) $\alpha_s(Q^2)$ decreases with increasing energy, described by:​

$$\frac{d\alpha_s}{d\ln Q} = -\beta_0 \alpha_s^2 + O(\alpha_s^3)$$

The discovery that the QCD beta function is negative (asymptotic freedom) was awarded the 2004 Nobel Prize.​

**Asymptotic Freedom in QCD:** At short distances (high energies), quarks interact weakly as nearly free particles], while at large distances (low energies), the interaction becomes strong, leading to quark confinement. Mathematically:​

$$\alpha_s(Q^2) \approx \frac{4\pi}{11 N_c - 2 N_f} \ln(Q^2/\Lambda_{\text{QCD}}^2)$$

where $N_c = 3$ colors, $N_f$ is active quark flavors, and $\Lambda_{\text{QCD}} \approx 200$ MeV is the confinement scale.​

## VI. Equilibrium Statistical Mechanics Foundations

**Fundamental Postulate:** The statistical distribution of a subsystem depends only on conserved quantities, leading to the canonical ensemble probability:​

$$P(\text{state}) \propto e^{-\beta E(\text{state})}$$

where $\beta = 1/k_B T$. Statistical independence and quasi-closure of subsystems enable reduction of complex many-body problems to tractable statistical descriptions. ​

**Ensembles and Thermodynamic Limit:** [Multiple equilibrium ensembles exist (microcanonical, canonical, grand-canonical), with thermodynamic quantities obtained as ensemble averages]. For a large system, [thermodynamic observables concentrate sharply around mean values with fluctuations suppressing to order $1/\sqrt{N}$], justifying the extraction of deterministic thermodynamic laws from microscopic dynamics. ​

**Boltzmann Distribution:** The probability to find a subsystem in state $i$ is $P_i \propto e^{-\beta E_i}$, yielding:​

- Entropy: $S = k_B \sum_i P_i \ln(g_i/P_i)$ (Gibbs entropy)
    
- Free energy: $F = -k_B T \ln Z$ where partition function $Z = \sum_i g_i e^{-\beta E_i}$
    

## VII. Non-Equilibrium Statistical Mechanics

**Approach to Equilibrium:** Isolated systems with non-equilibrium initial conditions evolve according to deterministic dynamics (Liouville/von Neumann equations), yet macroscopic relaxation to equilibrium is observed. This occurs because correlations with the environment destroy information of interest, appearing as randomness.
**Master Equations and Transport:** The Pauli-Van Hove master equation governs Markovian dynamics:​

$$\frac{dP_n}{dt} = \sum_m [W_{nm}P_m - W_{mn}P_n]$$

where $W_{nm}$ are transition rates. Linear response theory connects system response to external perturbations with equilibrium fluctuations via the fluctuation-dissipation theorem:

$$\chi(\omega) = \int_0^\infty dt \, e^{i\omega t} \langle [A(t), B] \rangle$$

This establishes that near-equilibrium response functions are completely determined by equilibrium correlations, enabling calculation of transport coefficients from equilibrium simulations.

## VIII. Renormalization Group and Scale Invariance

**RG Transformation:** The renormalization group integrates out degrees of freedom sequentially, starting from atomic scales and progressing to macroscopic scales. For a field theory with coupling $g$ at scale $\mu$, the [RG equation](https://www.damtp.cam.ac.uk/user/dbs26/AQFT/Wilsonchap.pdf) is:​

$$\mu \frac{dg}{d\mu} = \beta(g)$$

**Fixed Points and Flow:** Fixed points satisfy $\beta(g^*) = 0$, characterizing the long-distance physics. The linearized flow near a fixed point is determined by eigenvalues of the stability matrix, with:​

- **Relevant operators**: positive eigenvalues (grow under RG flow)
    
- **Irrelevant operators**: negative eigenvalues (suppress at long distances)
    
- **Marginal operators**: zero eigenvalues (require higher-order analysis)
    

Relevant and irrelevant operators can be identified by their mass dimension $d_{\text{op}}$ relative to the upper critical dimension $d_c$], though [some irrelevant operators can become important in certain regimes.​

**Epsilon Expansion:** Near the upper critical dimension $d = d_c - \epsilon$ for small $\epsilon$, [the Wilson-Fisher fixed point appears at]:​

$$g^* \approx \frac{8(n+8)\epsilon}{3(n+8)^2} + O(\epsilon^2)$$

Critical exponents expand as $\nu = \nu_0 + \nu_1 \epsilon + \cdots$, allowing [systematic perturbative calculation of universal properties].​

## IX. Critical Phenomena and Universality

**Universal Scaling:** [At continuous phase transitions, observables diverge as power laws characterized by critical exponents]. The [key insight is that microscopic details become irrelevant]—systems differing radically in their microscopic structure exhibit identical critical behavior [defined by dimensionality, symmetry, and range of interactions].[wikipedia+2](https://en.wikipedia.org/wiki/Renormalization_group)​

**Scaling Hypothesis:** Near criticality, the free energy per unit volume behaves as:

$$f(t, h) = |t|^{2-\alpha} F_\pm(h/|t|^{\Delta})$$

where $t$ is reduced temperature, $h$ is external field, and $F_\pm$ are universal scaling functions. This implies [scaling relations between exponents](https://www.thphys.uni-heidelberg.de/~wolschin/statsem24_1s.pdf):​

$$\nu d = 2 - \alpha \quad (\text{hyperscaling})$$
$$\alpha + 2\beta + \gamma = 2$$

**Universality Classes:** Systems cluster into universality classes determined solely by dimensionality, order parameter symmetry, and interaction range. The renormalization group explains this: different microscopies flow to the same fixed point, where fixed-point critical exponents are universal.[wikipedia+2](https://en.wikipedia.org/wiki/Critical_phenomena)​

## X. Emergence and Quantum Protectorate

**Collective Principles:** [Emergence refers to collective behaviors that cannot be predicted from microscopic laws alone]. Anderson's principle states ["more is different"]—macroscopic laws emerge from microscopic interactions through collective organization.[neuroquantology+1](https://www.neuroquantology.com/media/article_pdfs/Volume_20_No_7__PHYSICS_Emergent_Phenomena_in_Condensed_Matter_Physics_A_Review.pdf)​

**Quantum Protectorate:** [The concept reveals essential differences in complex many-body behavior between low-energy and high-energy scales]. At low energies, [emergent laws protect themselves from microscopic perturbations (quantum protectorate)], explaining:[arxiv+1](https://arxiv.org/pdf/1003.1363.pdf)​

- Why superconductivity persists despite material impurities
    
- How quasiparticles behave like elementary excitations despite complex interactions
    
- Why universality appears despite microscopic complexity
    

**Bogoliubov's Quasiaverages:** For degenerate ground states, ordinary thermal averages fail; quasiaverages involving infinitesimal symmetry-breaking fields restore physical information:

$$\langle\langle A \rangle\rangle = \lim_{\nu \to 0} \langle A \rangle_{\nu}$$

where the Hamiltonian includes a source term: $H_\nu = H + \nu(\vec{e} \cdot \vec{M})$. [This clarifies that symmetry breaking is not about the Lagrangian but about ground-state degeneracy]. 
## XI. Effective Field Theory Perspective

**Scale Separation and EFT:** [Effective field theories provide systematic descriptions of low-energy physics by integrating out high-energy degrees of freedom]. The [effective Lagrangian expands in powers of small parameters (energy scale ratios)]:[sciencedirect+1](https://www.sciencedirect.com/topics/physics-and-astronomy/effective-field-theory)​

$$$\mathcal{L}_{\text{eff}} = \mathcal{L}_{\text{low}} + \sum_{i} \frac{c_i}{\Lambda^{d_i - 4}} O_i$$
where $\Lambda$ is the cutoff scale and $O_i$ are higher-dimension operators. This ensures systematic error control through derivative and coupling expansions.

**Validity and Matchmaking:** EFTs are valid only below their cutoff, where heavy particles have been integrated out. Matching between UV (high-energy fundamental theory) and IR (low-energy effective theory) ensures that physical observables remain consistent across scales, with renormalization group running connecting different energy scales.
## XII. Conceptual Synthesis

The hierarchy of theoretical principles reveals a unified structure:

1. **Local symmetry** (gauge invariance) → determines interaction structure
    
2. **Noether's theorem** → connects symmetries to conservation laws
    
3. **Quantization & path integrals** → quantum dynamics from classical action
    
4. **Correlation functions** → extract physics through Wick contractions & Feynman diagrams
    
5. **Renormalization** → remove infinities, define running couplings
    
6. **RG flow & fixed points** → universal long-distance physics
    
7. **Emergence** → collective phenomena from microscopic laws
    
8. **Effective field theory** → systematic low-energy descriptions
    

The renormalization group provides the framework explaining why seemingly different systems exhibit identical critical behavior, while [emergence reconciles microscopic determinism with macroscopic laws](https://www.damtp.cam.ac.uk/user/dbs26/AQFT/Wilsonchap.pdf)​. 

---

**Key References:**

- [Landau, L. D., & Lifshitz, E. M. _Statistical Physics_ (1980): Foundational statistical mechanics establishing ensemble approach][archive](https://archive.org/download/ost-physics-landaulifshitz-statisticalphysics/LandauLifshitz-StatisticalPhysics_text.pdf)​
    
- [Wilson, K. G. Nobel Lecture (1982): Renormalization group connecting critical phenomena to quantum field theory][nobelprize](https://www.nobelprize.org/uploads/2018/06/wilson-lecture-2.pdf)​
    
- [Kuzemsky, A. L. _Bogoliubov's Quasiaverages_ (2010): Symmetry breaking and emergence in statistical physics][arxiv](https://arxiv.org/pdf/1003.1363.pdf)​
    
- [Gross, D., Wilczek, F., & Politzer, H. D. Asymptotic freedom in QCD (1973): Beta function negativity in non-Abelian theories][wikipedia](https://en.wikipedia.org/wiki/Asymptotic_freedom)​
    

---
