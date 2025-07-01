import React, { use } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from './AuthProvider';
import { GoogleAuthProvider } from 'firebase/auth';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate =useNavigate()
  const {LogIn, googleProvider} = use(AuthContext)
  const provider = new GoogleAuthProvider();
    const handleSignin =e=>{
        e.preventDefault();
        const email =e.target.email.value;
        const password =e.target.password.value;
        console.log(email, password)

        // firebase
        LogIn(email, password)
        .then(()=>{
          toast.success("Login Successfully")
          navigate("/")
        }).catch(()=>{
          toast.error("Please provide a valid Email and Password")
        })
    }

    const handelGoogle =()=>{
      googleProvider(provider)
      .then(()=>{
        toast.success("Logged in with Google!");
        navigate("/");
      })
      .catch(error=>{
        toast.error(error.message);
    })
    } 
    return (
        <div className="hero  min-h-screen ">
        <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="card md:w-[500px] w-[350px] border border-green-200 bg-gray-200 shrink-0 shadow-md">
        <div className="card-body">
        <form onSubmit={handleSignin} className="fieldset">

        <label className="label">Email</label>
        <input type="email" className="input w-full" name='email' placeholder="Email" />

          <label className="label">Password</label>
          <input type="password" className="input w-full" name='password' placeholder="Password" />

          <div><a className="link link-hover">Forgot password?</a></div>
          <button className="btn bg-green-500 text-white mt-4">Login</button>
          {/* Google */}
          <button onClick={handelGoogle} className="btn bg-white text-black border-1 border-[#e5e5e5]">
            <svg aria-label="Google logo" width="16" height="16" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g><path d="m0 0H512V512H0" fill="#fff"></path><path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"></path><path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"></path><path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"></path><path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"></path></g></svg>
            Login with Google
          </button>
          <Link to="/signup">Don't have an account? <span className='text-red-500 underline'>Sign In</span></Link>
        </form>
      </div>
    </div>
  </div>
</div>
    );
};

export default Login;