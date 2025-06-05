"use client"; // This directive is necessary for Next.js App Router client components

import React, { useState } from "react"; // Import useState
import Image from "next/image";

// Assuming you have your Chain Match logo image in the public folder.
// Replace this with the actual path to your logo.
const ChainMatchLogo = "/chain-match-logo.png"; // Example path to your logo

export default function Home() {
  return (
    // Main container now uses h-screen w-screen for full screen,
    // flex items-center justify-center for perfect centering,
    // and overflow-hidden to prevent scrolling.
    // Background gradient and neon blobs for visual effect.
    <main className="relative h-screen w-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Background circles/blobs for neon effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content wrapper - centered by parent `main` */}
      {/* Adjusted vertical padding (py) to optimize space for the form */}
      {/* max-h-screen added to contain content within screen height */}
      <div className="relative z-10 py-4 flex flex-col items-center w-full max-w-screen-lg px-4 md:px-8 max-h-screen">
        {/* Header section with logo and title */}
        <Header />

        {/* Signup Form section */}
        <SignUpForm />

        {/* How It Works section is intentionally commented out as per previous request */}
        {/* <HowItWorks /> */}
      </div>

      {/* Custom Scrollbar Styles (kept for consistency, though not strictly needed with overflow-hidden) */}
      <style jsx global>{`
        /* Webkit (Chrome, Safari, Edge) */
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 0, 255, 0.6); /* Neon pink */
          border-radius: 10px;
          border: 2px solid rgba(0, 0, 0, 0.2);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 255, 255, 0.8); /* Neon blue on hover */
        }

        /* Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 0, 255, 0.6) rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </main>
  );
}

function Header() {
  return (
    // Header component containing the logo and app title
    // Reduced bottom margin (mb) significantly
    <header className="flex flex-col items-center mb-6 md:mb-8"> {/* Adjusted mb */}
      {/* Chain Match Logo */}
      <Image
        src={ChainMatchLogo} // Using the defined logo path
        alt="Chain Match Logo"
        width={120} // Further reduced width for compactness
        height={120} // Further reduced height for compactness
        className="size-[90px] md:size-[120px] mb-2 drop-shadow-2xl" // Reduced mb
        style={{
          filter: "drop-shadow(0px 0px 30px #ff00ff)", // More intense neon pink shadow
          background: 'radial-gradient(circle at center, rgba(255,0,255,0.4) 0%, transparent 70%)', // Neon pink glow
          borderRadius: '50%', // Make it circular if the logo is square
        }}
      />

      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-1 text-white text-center drop-shadow-lg" // Reduced text size and bottom margin
          style={{ textShadow: "0 0 10px #ff00ff, 0 0 20px #00ffff" }}> {/* Neon text shadow */}
        Chain <span className="text-blue-400">Match</span>
      </h1>

      <p className="text-sm text-pink-300 text-center max-w-xs font-medium" // Reduced text size and max-w
         style={{ textShadow: "0 0 6px #ff00ff" }}> {/* Subtle neon text shadow */}
        Forge unbreakable connections for a new relationship.
      </p>
    </header>
  );
}

function SignUpForm() {
  // State variables for each form field
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [hobby, setHobby] = useState("");
  const [dob, setDob] = useState(""); // Date of Birth (Tanggal Lahir)
  const [bio, setBio] = useState(""); // State for Bio field
  const [isGeneratingBio, setIsGeneratingBio] = useState(false); // State for loading indicator

  // New states for file inputs
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [ktpPhotoFile, setKtpPhotoFile] = useState<File | null>(null);

  // Function to generate bio using your provided API endpoint
  const handleGenerateBio = async () => {
    setIsGeneratingBio(true);
    setBio("Generating bio..."); // Show generating message immediately

    try {
      // Construct the request body from form inputs
      const requestBody = {
        name: name || '',
        birth_date: dob || '', // Ensure format matches 'YYYY-MM-DD'
        gender: gender || '',
        city: city || '',
        hobbies: hobby || '' // This should be comma-separated already from user input
      };

      console.log(requestBody);

      const apiUrl = "https://project-tbc.onrender.com/generate-bio";

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        // Handle HTTP errors
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Assuming the API returns a JSON object with a 'bio' key
      if (result && result.bio) {
        setBio(result.bio);
      } else {
        setBio("Gagal menghasilkan bio. Coba lagi atau tulis manual.");
        console.error("API returned unexpected structure or no bio content:", result);
      }

    } catch (error) {
      console.error("Error calling generate-bio API:", error);
      setBio(`Gagal menghasilkan bio: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsGeneratingBio(false);
    }
  };

  // Handle file input changes
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhotoFile(e.target.files[0]);
    } else {
      setProfilePhotoFile(null);
    }
  };

  const handleKtpPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setKtpPhotoFile(e.target.files[0]);
    } else {
      setKtpPhotoFile(null);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => { // Use React.FormEvent for better typing
    e.preventDefault(); // Prevent default form submission behavior
    // Log all form data to the console for demonstration
    console.log("Signup Form Data:", {
      name,
      dob,
      gender,
      city,
      hobby, // Hobby is expected to be comma-separated
      bio, // Include the new bio field
      profilePhoto: profilePhotoFile ? profilePhotoFile.name : 'No file selected',
      ktpPhoto: ktpPhotoFile ? ktpPhotoFile.name : 'No file selected',
    });
    // In a real application, you would send this data (including files) to a backend or a storage service.
    // IMPORTANT: Replace this alert with a custom modal/toast notification.
    // alerts are blocked in the Canvas environment.
    alert("Form submitted! Check console for data. (This is a placeholder)");
  };

  return (
    // Signup form container with neon borders and background
    // Optimized max-w, padding, and bottom margin for compactness
    <div className="w-full max-w-sm bg-gray-900 bg-opacity-70 backdrop-blur-sm p-5 rounded-xl shadow-2xl border border-pink-500 animate-pulse-border mb-6"> {/* Adjusted mb */}
      <h2 className="text-xl font-bold text-white text-center mb-5" // Reduced text size and bottom margin
          style={{ textShadow: "0 0 8px #00ffff" }}> {/* Neon text shadow */}
        Buat Profil Anda
      </h2>
      <form onSubmit={handleSubmit} className="space-y-3"> {/* Reduced space-y */}
        {/* Main form fields (Nama, DOB, Gender, Kota, Hobi, Bio) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3"> {/* Responsive grid layout */}
          {/* Nama Lengkap Input */}
          <div className="md:col-span-1"> {/* Take 1 column on medium screens */}
            <label htmlFor="name" className="block text-pink-300 text-xs font-medium mb-1"
                   style={{ textShadow: "0 0 4px #ff00ff" }}>
              Nama Lengkap
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 text-sm bg-gray-800 bg-opacity-70 text-white border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 shadow-inner neon-input-shadow"
              placeholder="Nama Lengkap Anda"
              required
            />
          </div>

          {/* Tanggal Lahir Input */}
          <div className="md:col-span-1">
            <label htmlFor="dob" className="block text-pink-300 text-xs font-medium mb-1"
                   style={{ textShadow: "0 0 4px #ff00ff" }}>
              Tanggal Lahir
            </label>
            <input
              type="date"
              id="dob"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-2 text-sm bg-gray-800 bg-opacity-70 text-white border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 shadow-inner neon-input-shadow"
              required
            />
          </div>

          {/* Gender Select */}
          <div className="md:col-span-1">
            <label htmlFor="gender" className="block text-pink-300 text-xs font-medium mb-1"
                   style={{ textShadow: "0 0 4px #ff00ff" }}>
              Gender
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full p-2 text-sm bg-gray-800 bg-opacity-70 text-white border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 appearance-none shadow-inner neon-input-shadow"
              required
            >
              <option value="">Pilih</option>
              <option value="male">Pria</option>
              <option value="female">Wanita</option>
              <option value="other">Lainnya</option>
            </select>
          </div>

          {/* Kota Input */}
          <div className="md:col-span-1">
            <label htmlFor="city" className="block text-pink-300 text-xs font-medium mb-1"
                   style={{ textShadow: "0 0 4px #ff00ff" }}>
              Kota
            </label>
            <input
              type="text"
              id="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-2 text-sm bg-gray-800 bg-opacity-70 text-white border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 shadow-inner neon-input-shadow"
              placeholder="Kota Anda"
              required
            />
          </div>

          {/* Hobi Input (Comma-separated) - Full width on grid */}
          <div className="md:col-span-2"> {/* Take full width on medium screens */}
            <label htmlFor="hobby" className="block text-pink-300 text-xs font-medium mb-1"
                   style={{ textShadow: "0 0 4px #ff00ff" }}>
              Hobi (Comma-separated)
            </label>
            <input
              type="text"
              id="hobby"
              value={hobby}
              onChange={(e) => setHobby(e.target.value)}
              className="w-full p-2 text-sm bg-gray-800 bg-opacity-70 text-white border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 shadow-inner neon-input-shadow"
              placeholder="Contoh: Membaca, Olahraga, Coding"
              required
            />
          </div>

          {/* Bio Input - Full width on grid */}
          <div className="md:col-span-2"> {/* Take full width on medium screens */}
            <label htmlFor="bio" className="block text-pink-300 text-xs font-medium mb-1"
                   style={{ textShadow: "0 0 4px #ff00ff" }}>
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3} // Adjust rows for height
              className="w-full p-2 text-sm bg-gray-800 bg-opacity-70 text-white border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 shadow-inner neon-input-shadow resize-y"
              placeholder="Tulis bio singkat tentang diri Anda atau klik 'Generate Bio'"
            ></textarea>
            <button
              type="button" // Important: type="button" to prevent form submission
              onClick={handleGenerateBio}
              disabled={isGeneratingBio} // Disable button while generating
              className={`w-full py-2 mt-2 text-xs font-bold rounded-md transition-all duration-300 transform hover:scale-105 neon-button-shadow
                ${isGeneratingBio ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600'}
              `}
            >
              {isGeneratingBio ? 'Generating...' : 'Generate Bio'}
            </button>
          </div>

          {/* Photo Inputs - Now in their own row, side-by-side on medium screens */}
          <div className="md:col-span-2 flex flex-col md:flex-row gap-4"> {/* Full width on grid, flex for internal layout */}
            {/* Profile Photo Input */}
            <div className="flex-1"> {/* Take equal width */}
              <label htmlFor="profilePhoto" className="block text-pink-300 text-xs font-medium mb-1"
                     style={{ textShadow: "0 0 4px #ff00ff" }}>
                Foto Profil
              </label>
              <input
                type="file"
                id="profilePhoto"
                accept="image/*" // Accept only image files
                onChange={handleProfilePhotoChange}
                className="w-full p-2 text-sm bg-gray-800 bg-opacity-70 text-white border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 shadow-inner neon-input-shadow file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-violet-500 file:text-white hover:file:bg-violet-600"
                required
              />
              {profilePhotoFile && (
                <p className="text-xs text-blue-300 mt-1">File dipilih: {profilePhotoFile.name}</p>
              )}
            </div>

            {/* KTP Photo Input */}
            <div className="flex-1"> {/* Take equal width */}
              <label htmlFor="ktpPhoto" className="block text-pink-300 text-xs font-medium mb-1"
                     style={{ textShadow: "0 0 4px #ff00ff" }}>
                Foto KTP
              </label>
              <input
                type="file"
                id="ktpPhoto"
                accept="image/*" // Accept only image files
                onChange={handleKtpPhotoChange}
                className="w-full p-2 text-sm bg-gray-800 bg-opacity-70 text-white border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300 shadow-inner neon-input-shadow file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-violet-500 file:text-white hover:file:bg-violet-600"
                required
              />
              {ktpPhotoFile && (
                <p className="text-xs text-blue-300 mt-1">File dipilih: {ktpPhotoFile.name}</p>
              )}
            </div>
          </div>
        </div> {/* End of grid container */}

        {/* Submit Button - outside the grid, takes full width */}
        <button
          type="submit"
          className="w-full py-2 mt-6 text-base font-bold rounded-full bg-gradient-to-r from-blue-500 to-pink-600 text-white shadow-lg hover:from-blue-600 hover:to-pink-700 transition-all duration-300 transform hover:scale-105 neon-button-shadow"
        >
          Daftar dan Temukan Jodoh!
        </button>
      </form>
    </div>
  );
}


// Keyframe animations for the neon effects (kept for reference, assume in global CSS)
/*
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

@keyframes pulse-border {
  0% {
    box-shadow: 0 0 0 0 rgba(255, 0, 255, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(255, 0, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(255, 0, 255, 0);
  }
}

.neon-input-shadow {
  box-shadow: 0 0 5px #00ffff;
}
.neon-input-shadow:focus {
  box-shadow: 0 0 10px #ff00ff;
}

.neon-button-shadow {
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.6), 0 0 25px rgba(0, 255, 255, 0.6);
}
.neon-button-shadow:hover {
  box-shadow: 0 0 20px rgba(255, 0, 255, 0.8), 0 0 35px rgba(0, 255, 255, 0.8);
}

.neon-card-glow {
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.5);
}
.neon-card-glow:hover {
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.7), 0 0 25px rgba(0, 255, 255, 0.7);
}

@keyframes bounceSlow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.animate-blob {
  animation: blob 7s infinite cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

.animate-pulse-border {
  animation: pulse-border 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
}
*/
